package com.example.bootcamp.service;

import com.example.bootcamp.dto.Response.AdminOrderResponse;
import com.example.bootcamp.dto.Response.AdminDashboardResponse;
import com.example.bootcamp.entity.OrdersEntity;
import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.entity.WalletsEntity;
import com.example.bootcamp.entity.WalletLogsEntity;
import com.example.bootcamp.repository.OrderRepository;
import com.example.bootcamp.repository.UserRepository;
import com.example.bootcamp.repository.WalletRepository;
import com.example.bootcamp.repository.WalletLogRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletLogRepository walletLogRepository;

    public List<UsersEntity> getAllReseller() {
        return userRepository.findAll();
    }

    @Transactional
    public String updateResellerStatus(Integer userId , UsersEntity.Status status) {
        UsersEntity usersEntity = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("ไม่พบตัวแทน"));
        if (!"reseller".equalsIgnoreCase(usersEntity.getRole().name())) {
            throw new RuntimeException("ผู้ใช้งานคนนนี้ไม่ใช่ตัวแทน");
        }
        usersEntity.setStatus(status);
        userRepository.save(usersEntity);
        return "เปลี่ยนสถานะเป็น" + status + "เรียบร้อย";
    }

    @Transactional
    public org.springframework.data.domain.Page<AdminOrderResponse> getAllOrder(org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<OrdersEntity> ordersPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        
        return ordersPage.map(order -> {
            List<String> items = new ArrayList<>();
            if (order.getOrderItems() != null) {
                for (com.example.bootcamp.entity.OrderItemsEntity item : order.getOrderItems()) {
                    items.add(item.getProductName() + " (x" + item.getQuantity() + ")");
                }
            }
            return new AdminOrderResponse(
                    order.getId(),
                    order.getOrderNumber(),
                    order.getShop().getShopName(),
                    order.getCustomerName(),
                    items,
                    order.getTotalAmount(),
                    order.getStatus().toString(),
                    order.getCreatedAt()
            );
        });
    }

    @Transactional
    public String updateOrderStatus(Integer orderId, OrdersEntity.Status status) {
        OrdersEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์นี้"));

        if (order.getStatus() != OrdersEntity.Status.pending && status == OrdersEntity.Status.shipped) {
            throw new RuntimeException("ออเดอร์นี้ไม่ได้อยู่ในสถานะรอดำเนินการ");
        }

        order.setStatus(status);
        orderRepository.save(order);

        if (status == OrdersEntity.Status.shipped) {
            UsersEntity reseller = order.getShop().getUser();
            WalletsEntity wallet = walletRepository.findByUserId(reseller.getId())
                    .orElseGet(() -> {
                        WalletsEntity newWallet = new WalletsEntity();
                        newWallet.setUser(reseller);
                        newWallet.setBalance(BigDecimal.ZERO);
                        return walletRepository.save(newWallet);
                    });

            wallet.setBalance(wallet.getBalance().add(order.getResellerProfit()));
            walletRepository.save(wallet);

            WalletLogsEntity log = new WalletLogsEntity();
            log.setWallet(wallet);
            log.setAmount(order.getResellerProfit());
            walletLogRepository.save(log);
        }

        return "อัปเดตสถานะออเดอร์เป็น " + status + " เรียบร้อย";
    }

    public AdminDashboardResponse getDashboardStatistics() {
        List<OrdersEntity> orders = orderRepository.findAll();
        List<UsersEntity> users = userRepository.findAll();

        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal totalResellerProfit = BigDecimal.ZERO;
        long totalOrders = orders.size();
        long pendingOrders = 0;

        for (OrdersEntity o : orders) {
            if (o.getStatus() == OrdersEntity.Status.shipped || o.getStatus() == OrdersEntity.Status.completed) {
                if (o.getTotalAmount() != null) {
                    totalSales = totalSales.add(o.getTotalAmount());
                }
                if (o.getResellerProfit() != null) {
                    totalResellerProfit = totalResellerProfit.add(o.getResellerProfit());
                }
            } else if (o.getStatus() == OrdersEntity.Status.pending) {
                pendingOrders++;
            }
        }

        long totalApprovedResellers = 0;
        long totalPendingResellers = 0;
        for (UsersEntity u : users) {
            if (u.getRole() == UsersEntity.Role.reseller) {
                if (u.getStatus() == UsersEntity.Status.approved) {
                    totalApprovedResellers++;
                } else if (u.getStatus() == UsersEntity.Status.pending) {
                    totalPendingResellers++;
                }
            }
        }

        return new AdminDashboardResponse(totalSales, totalResellerProfit, totalOrders, pendingOrders, totalApprovedResellers, totalPendingResellers);
    }
}

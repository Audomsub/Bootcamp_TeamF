package com.example.bootcamp.service;

import com.example.bootcamp.dto.Response.AdminOrderResponse;
import com.example.bootcamp.entity.OrdersEntity;
import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.repository.OrderRepository;
import com.example.bootcamp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<UsersEntity> getAllReseller() {
        return userRepository.findAll();
    }

    @Transactional
    public String updateResellerStatus(Long userId , UsersEntity.Status status) {
        UsersEntity usersEntity = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("ไม่พบตัวแทน"));
        if (!"reseller".equalsIgnoreCase(usersEntity.getRole().name())) {
            throw new RuntimeException("ผู้ใช้งานคนนนี้ไม่ใช่ตัวแทน");
        }
        usersEntity.setStatus(status);
        userRepository.save(usersEntity);
        return "เปลี่ยนสถานะเป็น" + status + "เรียบร้อย";
    }

    @Transactional
    public List<AdminOrderResponse> getAllOrder() {
        List<OrdersEntity> ordersEntityList = orderRepository.findAll();
        List<AdminOrderResponse> adminOrderResponses = new ArrayList<>();
        for (OrdersEntity ordersEntity : ordersEntityList) {
            AdminOrderResponse adminOrderResponse = new AdminOrderResponse(
                    ordersEntity.getId(),
                    ordersEntity.getOrderNumber(),
                    ordersEntity.getShop().getShopName(),
                    ordersEntity.getCustomerName(),
                    ordersEntity.getTotalAmount(),
                    ordersEntity.getStatus().toString(),
                    ordersEntity.getCreatedAt()
            );
            adminOrderResponses.add(adminOrderResponse);
        }
        return adminOrderResponses;
    }
}

package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.*;
import com.example.bootcamp.dto.Response.*;
import com.example.bootcamp.entity.*;
import com.example.bootcamp.repository.*;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ResellerService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ShopProductRepository shopProductRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private WalletRepository walletRepository;

    @Transactional
    public Page<ResellerProductResponse> getMyProducts(String email, Pageable pageable) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        Page<ShopProductsEntity> page = shopProductRepository.findByShopId(shop.getId(), pageable);
        return page.map(ResellerProductResponse::fromEntity);
    }

    @Transactional
    public List<ResellerCatalogResponse> getCentralCatalogByUsername(String email) {
        System.out.println("กำลังค้นหาผู้ใช้ด้วยชื่อ: " + email);
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน: " + email));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        List<ProductsEntity> allProducts = productRepository.findAll();

        List<ResellerCatalogResponse> responseList = new ArrayList<>();

        for (ProductsEntity product : allProducts) {

            Optional<ShopProductsEntity> shopProductOpt = shopProductRepository
                    .findByShopIdAndProductId(shop.getId(), product.getId());

            boolean isAdded = false;
            BigDecimal currentPrice = null;
            if (shopProductOpt.isPresent()) {
                isAdded = true;
                currentPrice = shopProductOpt.get().getSellingPrice();
            }
            ResellerCatalogResponse resellerCatalogResponse = new ResellerCatalogResponse(
                    product.getId(),
                    product.getProductName(),
                    product.getImageUrl(),
                    product.getCostPrice(),
                    product.getMinSellPrice(),
                    product.getStock(),
                    isAdded,
                    currentPrice);
            responseList.add(resellerCatalogResponse);
        }

        return responseList;
    }

    @Transactional
    public String selectProductToShop(String email, ResellerCatalogRequest request) {

        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน: " + email));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        ProductsEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้าในระบบ"));

        if (product.getStock() <= 0) {
            return "สินค้าหมด ไม่สามารถเพิ่มเข้าร้านได้";
        }

        if (request.getSellingPrice().compareTo(product.getMinSellPrice()) < 0) {
            return "ราคาขายต้องไม่ต่ำกว่า " + product.getMinSellPrice() + " บาท";
        }

        Optional<ShopProductsEntity> existing = shopProductRepository
                .findByShopIdAndProductId(shop.getId(), product.getId());

        if (existing.isPresent()) {
            ShopProductsEntity shopProduct = existing.get();
            shopProduct.setSellingPrice(request.getSellingPrice());
            shopProductRepository.save(shopProduct);
            return "แก้ไขราคาขายสำเร็จ";
        } else {
            ShopProductsEntity newShopProduct = new ShopProductsEntity();
            newShopProduct.setShop(shop);
            newShopProduct.setProduct(product);
            newShopProduct.setSellingPrice(request.getSellingPrice());
            shopProductRepository.save(newShopProduct);
            return "เพิ่มสินค้าเข้าร้านสำเร็จ";
        }
    }

    @Transactional
    public Page<ResellerOrderResponse> getMyOrder(String email, Pageable pageable) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        ShopsEntity shopsEntity = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        Page<OrdersEntity> ordersPage = orderRepository.findRecentByShopId(shopsEntity.getId(), pageable);

        return ordersPage.map(order -> {
            BigDecimal orderTotalSelling = BigDecimal.ZERO;
            BigDecimal orderTotalProfit = BigDecimal.ZERO;
            StringBuilder productName = new StringBuilder();

            for (OrderItemsEntity item : order.getOrderItems()) {
                BigDecimal qty = new BigDecimal(item.getQuantity());
                orderTotalSelling = orderTotalSelling.add(item.getSellingPrice().multiply(qty));
                orderTotalProfit = orderTotalProfit
                        .add(item.getSellingPrice().subtract(item.getCostPrice()).multiply(qty));

                if (productName.length() > 0)
                    productName.append(" , ");
                productName.append(item.getProductName()).append(" (").append(item.getQuantity()).append(")");
            }

            return new ResellerOrderResponse(
                    order.getId(),
                    order.getOrderNumber(),
                    order.getCustomerName(),
                    productName.toString(),
                    orderTotalSelling,
                    orderTotalProfit,
                    order.getStatus().name(),
                    order.getCreatedAt());
        });
    }

    @Transactional
    public com.example.bootcamp.dto.Response.ResellerDashboardResponse getResellerDashboardStats(String email) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        BigDecimal totalProfit = orderRepository.sumProfitByShopId(shop.getId());
        if (totalProfit == null)
            totalProfit = BigDecimal.ZERO;

        long totalOrders = orderRepository.countByShopId(shop.getId());
        long pendingOrders = orderRepository.countByShopIdAndStatus(shop.getId(), OrdersEntity.Status.pending);

        // Optimized way to fetch 5 latest orders
        org.springframework.data.domain.Page<OrdersEntity> recentOrdersPage = orderRepository
                .findRecentByShopId(shop.getId(), org.springframework.data.domain.PageRequest.of(0, 5));

        List<ResellerOrderResponse> recentOrders = new ArrayList<>();
        for (OrdersEntity order : recentOrdersPage.getContent()) {
            StringBuilder pn = new StringBuilder();
            BigDecimal selling = BigDecimal.ZERO;
            BigDecimal profit = BigDecimal.ZERO;

            for (OrderItemsEntity item : order.getOrderItems()) {
                BigDecimal q = new BigDecimal(item.getQuantity());
                selling = selling.add(item.getSellingPrice().multiply(q));
                profit = profit.add(item.getSellingPrice().subtract(item.getCostPrice()).multiply(q));
                if (pn.length() > 0)
                    pn.append(", ");
                pn.append(item.getProductName()).append(" (").append(item.getQuantity()).append(")");
            }

            recentOrders.add(new ResellerOrderResponse(
                    order.getId(),
                    order.getOrderNumber(),
                    order.getCustomerName(),
                    pn.toString(),
                    selling,
                    profit,
                    order.getStatus().name(),
                    order.getCreatedAt()));
        }

        // Compute last 7 days chart
        List<OrdersEntity> allOrders = orderRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());
        List<java.util.Map<String, Object>> salesChart = new ArrayList<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd MMM");

        for (int i = 6; i >= 0; i--) {
            java.time.LocalDate targetDate = today.minusDays(i);
            BigDecimal dailyAmount = BigDecimal.ZERO;
            BigDecimal dailyProfit = BigDecimal.ZERO;

            for (OrdersEntity o : allOrders) {
                if (o.getCreatedAt() != null) {
                    java.time.LocalDate orderDate = o.getCreatedAt().atZone(java.time.ZoneId.systemDefault())
                            .toLocalDate();
                    if (orderDate.equals(targetDate)) {
                        dailyAmount = dailyAmount
                                .add(o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO);
                        dailyProfit = dailyProfit
                                .add(o.getResellerProfit() != null ? o.getResellerProfit() : BigDecimal.ZERO);
                    }
                }
            }

            java.util.Map<String, Object> dayData = new java.util.HashMap<>();
            dayData.put("date", targetDate.format(formatter));
            dayData.put("amount", dailyAmount);
            dayData.put("profit", dailyProfit);
            salesChart.add(dayData);
        }

        return com.example.bootcamp.dto.Response.ResellerDashboardResponse.builder()
                .totalProfit(totalProfit)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .recentOrders(recentOrders)
                .salesChart(salesChart)
                .build();
    }

    @Transactional
    public ResellerWalletResponse getWalletDetails(String email, Pageable pageable) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        WalletsEntity wallet = walletRepository.findByUserId(user.getId()).orElse(null);
        BigDecimal balance = wallet != null ? wallet.getBalance() : BigDecimal.ZERO;

        ShopsEntity shop = shopRepository.findByUserId(user.getId()).orElse(null);
        List<WalletLogResponse> history = new ArrayList<>();
        if (shop != null) {
            Page<OrdersEntity> ordersPage = orderRepository.findRecentByShopId(shop.getId(), pageable);
            for (OrdersEntity o : ordersPage.getContent()) {
                if (o.getStatus() == OrdersEntity.Status.shipped || o.getStatus() == OrdersEntity.Status.completed) {
                    history.add(WalletLogResponse.builder()
                            .id(o.getId())
                            .amount(o.getResellerProfit())
                            .createdAt(o.getCreatedAt())
                            .order(WalletLogResponse.OrderSummary.builder()
                                    .orderNumber(o.getOrderNumber())
                                    .build())
                            .build());
                }
            }
        }

        return ResellerWalletResponse.builder()
                .wallet(ResellerWalletResponse.WalletInfo.builder().balance(balance).build())
                .logs(history)
                .build();
    }

    @Transactional
    public void updateProductPrice(String email, Integer shopProductId, BigDecimal newPrice) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        ShopProductsEntity shopProduct = shopProductRepository.findById(shopProductId)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้านี้ในร้านของคุณ"));

        if (!shopProduct.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("คุณไม่มีสิทธิ์แก้ไขสินค้านี้");
        }

        ProductsEntity product = shopProduct.getProduct();
        if (newPrice.compareTo(product.getMinSellPrice()) < 0) {
            throw new RuntimeException("ราคาขายต้องไม่ต่ำกว่า " + product.getMinSellPrice() + " บาท");
        }

        shopProduct.setSellingPrice(newPrice);
        shopProductRepository.save(shopProduct);
    }

    @Transactional
    public void removeProductFromShop(String email, Integer shopProductId) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        ShopProductsEntity shopProduct = shopProductRepository.findById(shopProductId)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้านี้ในร้านของคุณ"));

        if (!shopProduct.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("คุณไม่มีสิทธิ์ลบสินค้านี้");
        }

        shopProductRepository.delete(shopProduct);
    }
}
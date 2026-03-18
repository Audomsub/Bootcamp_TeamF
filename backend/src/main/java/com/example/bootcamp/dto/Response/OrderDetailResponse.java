package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDetailResponse {
    private Integer id;
    private String orderNumber;
    private String shopName;
    private String customerName;
    private List<String> items;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;

    public OrderDetailResponse(Integer id, String orderNumber, String shopName, String customerName, List<String> items, BigDecimal totalAmount, String status, LocalDateTime createdAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.shopName = shopName;
        this.customerName = customerName;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public String getShopName() { return shopName; }
    public String getCustomerName() { return customerName; }
    public List<String> getItems() { return items; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

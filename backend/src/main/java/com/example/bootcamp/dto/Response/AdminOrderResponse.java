package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminOrderResponse {

    private Integer id;
    private String orderNumber;
    private String customerName;
    private String shopName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;

    public AdminOrderResponse(Integer id, String orderNumber, String shopName, String customerName,
                              BigDecimal totalAmount, String status, LocalDateTime createdAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.shopName = shopName;
        this.customerName = customerName;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
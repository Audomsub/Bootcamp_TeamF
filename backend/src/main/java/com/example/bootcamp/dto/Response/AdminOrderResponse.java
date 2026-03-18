package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminOrderResponse {

    private Integer id;
    private String orderNumber;
    private String customerName;
    private String shopName;
    private List<String> items;
    private BigDecimal totalAmount;
    private BigDecimal resellerProfit;
    private String status;
    private LocalDateTime createdAt;

    public AdminOrderResponse(Integer id, String orderNumber, String shopName, String customerName,
                              List<String> items, BigDecimal totalAmount, BigDecimal resellerProfit, String status, LocalDateTime createdAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.shopName = shopName;
        this.customerName = customerName;
        this.items = items;
        this.totalAmount = totalAmount;
        this.resellerProfit = resellerProfit;
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

    public List<String> getItems() { return items; }
    public void setItems(List<String> items) { this.items = items; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getResellerProfit() { return resellerProfit; }
    public void setResellerProfit(BigDecimal resellerProfit) { this.resellerProfit = resellerProfit; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
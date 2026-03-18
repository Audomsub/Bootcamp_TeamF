package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class TrackOrderResponse {
    private String orderNumber;
    private String status;
    private List<String> items;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    public TrackOrderResponse(String orderNumber, String status, List<String> items, String shippingAddress, BigDecimal totalAmount, LocalDateTime createdAt) {
        this.orderNumber = orderNumber;
        this.status = status;
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getItems() { return items; }
    public void setItems(List<String> items) { this.items = items; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

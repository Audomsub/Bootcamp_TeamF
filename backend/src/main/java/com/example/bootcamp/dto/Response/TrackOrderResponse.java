package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class TrackOrderResponse {
    private String orderNumber;
    private String status;
    private List<TrackOrderItemResponse> items;
    private String customerName;
    private String customerPhone;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    public TrackOrderResponse(String orderNumber, String status, List<TrackOrderItemResponse> items, String customerName, String customerPhone, String shippingAddress, BigDecimal totalAmount, LocalDateTime createdAt) {
        this.orderNumber = orderNumber;
        this.status = status;
        this.items = items;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.shippingAddress = shippingAddress;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<TrackOrderItemResponse> getItems() { return items; }
    public void setItems(List<TrackOrderItemResponse> items) { this.items = items; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class TrackOrderItemResponse {
        private String productName;
        private Integer quantity;
        private BigDecimal sellingPrice;

        public TrackOrderItemResponse(String productName, Integer quantity, BigDecimal sellingPrice) {
            this.productName = productName;
            this.quantity = quantity;
            this.sellingPrice = sellingPrice;
        }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getSellingPrice() { return sellingPrice; }
        public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }
    }
}

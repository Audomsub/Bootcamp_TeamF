package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;

public class ResellerOrderResponse {

    private Integer orderId;

    private String customerName;

    private String productDescription;

    private BigDecimal totalAmount;

    private BigDecimal myProfit;

    private  String status;

    public ResellerOrderResponse(Integer orderId, String customerName, String productDescription, BigDecimal totalAmount, BigDecimal myProfit, String status) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.productDescription = productDescription;
        this.totalAmount = totalAmount;
        this.myProfit = myProfit;
        this.status = status;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getMyProfit() {
        return myProfit;
    }

    public void setMyProfit(BigDecimal myProfit) {
        this.myProfit = myProfit;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

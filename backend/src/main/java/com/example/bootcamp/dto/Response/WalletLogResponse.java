package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WalletLogResponse {
    private String orderNumber;
    private BigDecimal amount;
    private LocalDateTime date;

    public WalletLogResponse(String orderNumber, BigDecimal amount, LocalDateTime date) {
        this.orderNumber = orderNumber;
        this.amount = amount;
        this.date = date;
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}

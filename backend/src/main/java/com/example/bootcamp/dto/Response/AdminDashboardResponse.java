package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;

public class AdminDashboardResponse {
    private BigDecimal totalSales;
    private BigDecimal totalResellerProfit;
    private long totalOrders;
    private long pendingOrders;
    private long totalApprovedResellers;
    private long totalPendingResellers;

    public AdminDashboardResponse(BigDecimal totalSales, BigDecimal totalResellerProfit, long totalOrders, long pendingOrders, long totalApprovedResellers, long totalPendingResellers) {
        this.totalSales = totalSales;
        this.totalResellerProfit = totalResellerProfit;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.totalApprovedResellers = totalApprovedResellers;
        this.totalPendingResellers = totalPendingResellers;
    }

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

    public BigDecimal getTotalResellerProfit() { return totalResellerProfit; }
    public void setTotalResellerProfit(BigDecimal totalResellerProfit) { this.totalResellerProfit = totalResellerProfit; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getTotalApprovedResellers() { return totalApprovedResellers; }
    public void setTotalApprovedResellers(long totalApprovedResellers) { this.totalApprovedResellers = totalApprovedResellers; }

    public long getTotalPendingResellers() { return totalPendingResellers; }
    public void setTotalPendingResellers(long totalPendingResellers) { this.totalPendingResellers = totalPendingResellers; }
}

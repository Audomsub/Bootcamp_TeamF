package com.example.bootcamp.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResellerDashboardResponse {
    private BigDecimal totalProfit;
    private Long totalOrders;
    private Long pendingOrders;
    private List<ResellerOrderResponse> recentOrders;
}

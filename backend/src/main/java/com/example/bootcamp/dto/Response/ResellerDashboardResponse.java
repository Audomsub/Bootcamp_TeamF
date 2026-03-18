package com.example.bootcamp.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResellerDashboardResponse {
    private String shopName;
    private String shopSlug;
    private BigDecimal totalProfit;
    private Long orderCount;
}

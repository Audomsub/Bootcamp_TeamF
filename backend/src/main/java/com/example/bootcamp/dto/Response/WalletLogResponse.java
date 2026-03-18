package com.example.bootcamp.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletLogResponse {
    private Integer id;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private OrderSummary order;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderSummary {
        private String orderNumber;
    }
}

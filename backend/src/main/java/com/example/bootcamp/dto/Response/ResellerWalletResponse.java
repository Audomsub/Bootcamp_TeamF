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
public class ResellerWalletResponse {
    private WalletInfo wallet;
    private List<WalletLogResponse> logs;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WalletInfo {
        private BigDecimal balance;
    }
}

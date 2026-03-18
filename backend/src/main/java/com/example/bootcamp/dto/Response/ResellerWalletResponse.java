package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;
import java.util.List;

public class ResellerWalletResponse {
    private BigDecimal accumulatedProfit;
    private List<WalletLogResponse> history;

    public ResellerWalletResponse(BigDecimal accumulatedProfit, List<WalletLogResponse> history) {
        this.accumulatedProfit = accumulatedProfit;
        this.history = history;
    }

    public BigDecimal getAccumulatedProfit() { return accumulatedProfit; }
    public void setAccumulatedProfit(BigDecimal accumulatedProfit) { this.accumulatedProfit = accumulatedProfit; }
    public List<WalletLogResponse> getHistory() { return history; }
    public void setHistory(List<WalletLogResponse> history) { this.history = history; }
}

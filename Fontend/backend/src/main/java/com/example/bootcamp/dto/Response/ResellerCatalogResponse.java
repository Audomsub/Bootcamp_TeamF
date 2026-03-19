package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;

public class ResellerCatalogResponse {
    private Integer productId;
    private String productName;
    private String imageUrl;
    private BigDecimal costPrice;
    private BigDecimal minSellPrice;
    private Integer stock;
    private boolean isAdded;
    private BigDecimal sellingPrice;

    public ResellerCatalogResponse(Integer productId, String productName, String imageUrl,
                                   BigDecimal costPrice, BigDecimal minSellPrice,
                                   Integer stock, boolean isAdded, BigDecimal sellingPrice) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.costPrice = costPrice;
        this.minSellPrice = minSellPrice;
        this.stock = stock;
        this.isAdded = isAdded;
        this.sellingPrice = sellingPrice;
    }

    public Integer getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getCostPrice() { return costPrice; }
    public BigDecimal getMinSellPrice() { return minSellPrice; }
    public Integer getStock() { return stock; }
    public boolean getIsAdded() { return isAdded; }
    public BigDecimal getSellingPrice() { return sellingPrice; }
}
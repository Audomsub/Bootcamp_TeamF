package com.example.bootcamp.dto.Request;

import java.math.BigDecimal;

public class ResellerCatalogRequest {

    private Integer productId;

    private BigDecimal sellingPrice;

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }
}

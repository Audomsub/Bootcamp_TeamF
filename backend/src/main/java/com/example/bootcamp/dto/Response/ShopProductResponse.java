package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;

public class ShopProductResponse {
    private Integer pruductId;

    private String productName;

    private  String imageUrl;

    private BigDecimal sellingPrice;

    private Integer stock;

    public ShopProductResponse(Integer pruductId , String productName , String imageUrl , BigDecimal sellingPrice , Integer stock) {
        this.pruductId = pruductId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.sellingPrice = sellingPrice;
        this.stock = stock;
    }

    public Integer getPruductId() {
        return pruductId;
    }

    public void setPruductId(Integer pruductId) {
        this.pruductId = pruductId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}

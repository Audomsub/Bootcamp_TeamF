package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;

public class ShopProductResponse {
    private Integer productId;

    private String productName;

    private  String imageUrl;

    private BigDecimal sellingPrice;

    private Integer stock;

    public ShopProductResponse(Integer productId , String productName , String imageUrl , BigDecimal sellingPrice , Integer stock) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.sellingPrice = sellingPrice;
        this.stock = stock;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
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

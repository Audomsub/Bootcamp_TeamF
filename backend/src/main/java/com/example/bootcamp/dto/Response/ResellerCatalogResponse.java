package com.example.bootcamp.dto.Response;

import java.math.BigDecimal;

public class ResellerCatalogResponse {
    private Integer id;

    private String name;

    private String imageUrl;

    private BigDecimal costPrice;

    private BigDecimal minPrice;

    private Integer stock;

    private boolean isAdded;

    public ResellerCatalogResponse() {
    }

    public ResellerCatalogResponse(Integer id, String name, String imageUrl, BigDecimal costPrice, BigDecimal minPrice, Integer stock, boolean isAdded) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.costPrice = costPrice;
        this.minPrice = minPrice;
        this.stock = stock;
        this.isAdded = isAdded;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public boolean isAdded() {
        return isAdded;
    }

    public void setAdded(boolean added) {
        isAdded = added;
    }
}

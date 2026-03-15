package com.example.bootcamp.dto.Request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "ชื่อสินค้าห้ามว่าง")
    private String productName;

    private String imageUrl;

    private String description;

    @NotNull(message = "ราคาต้นทุนห้ามว่าง")
    @DecimalMin(value = "0.0", inclusive = false, message = "ราคาทุนต้องมากกว่า 0")
    private BigDecimal costPrice;

    @NotNull(message = "ราคาขายขั้นต่ำห้ามว่าง")
    @DecimalMin(value = "0.0", inclusive = false, message = "ราคาขายต้องมากกว่า 0")
    private BigDecimal minSellPrice;

    @NotNull(message = "จำนวนสต็อกห้ามว่าง")
    private Integer stock;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public BigDecimal getMinSellPrice() {
        return minSellPrice;
    }

    public void setMinSellPrice(BigDecimal minSellPrice) {
        this.minSellPrice = minSellPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
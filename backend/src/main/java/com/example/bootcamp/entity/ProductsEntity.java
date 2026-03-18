package com.example.bootcamp.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.w3c.dom.Text;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products" , schema = "public")
public class ProductsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name" , nullable = false)
    private String productName;

    @Column(name = "description" , columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url" , length = 500)
    private String imageUrl;

    @Column(name = "cost_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "min_price" , nullable = false , precision = 10 , scale = 2)
    private  BigDecimal minSellPrice;

    @Column(name = "stock")
    private Integer stock = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getMinSellPrice() {
        return minSellPrice;
    }

    public void setMinSellPrice(BigDecimal minSellPrice) {
        this.minSellPrice = minSellPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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


    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

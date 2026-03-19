package com.example.bootcamp.dto.Request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "ชื่อสินค้าห้ามว่าง")
    private String name;

    private String description;

    @NotNull(message = "ราคาต้นทุนห้ามว่าง")
    @DecimalMin(value = "0.0", inclusive = false, message = "ราคาทุนต้องมากกว่า 0")
    private BigDecimal cost_price;

    @NotNull(message = "ราคาขายขั้นต่ำห้ามว่าง")
    @DecimalMin(value = "0.0", inclusive = false, message = "ราคาขายต้องมากกว่า 0")
    private BigDecimal min_price;

    @NotNull(message = "จำนวนสต็อกห้ามว่าง")
    private Integer stock;

    private MultipartFile image;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getCost_price() { return cost_price; }
    public void setCost_price(BigDecimal cost_price) { this.cost_price = cost_price; }

    public BigDecimal getMin_price() { return min_price; }
    public void setMin_price(BigDecimal min_price) { this.min_price = min_price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public MultipartFile getImage() { return image; }
    public void setImage(MultipartFile image) { this.image = image; }
}
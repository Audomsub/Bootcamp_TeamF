package com.example.bootcamp.dto.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderItemRequest {
    @NotNull(message = "รหัสสินค้าห้ามว่าง")
    private Integer productId;

    @NotNull(message = "จำนวนสินค้าห้ามว่าง")
    @Min(value = 1 , message = "จำนวนสินค้าขั้นต่ำต้องมากกว่า 1")
    private Integer quantity;

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}

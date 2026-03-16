package com.example.bootcamp.dto.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderRequest {

    @NotBlank(message = "ชื่อลูกค้าห้ามว่าง")
    private String customerName;

    @NotBlank(message = "เบอร์โทรศัพท์ลูกห้ามว่าง")
    private String customerPhone;

    @NotBlank(message = "ที่อยู่ลูกค้าห้ามว่าง")
    private String customerAddress;

    @NotNull(message = "รหัสสินค้าห้ามว่าง")
    private Integer productId;

    @NotNull(message = "จำนวนสินค้าห้ามว่าง")
    @Min(value = 1 , message = "จำนวนสินค้าขั้นต่ำต้องมากกว่า 1")
    private Integer amountProduct;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getAmountProduct() {
        return amountProduct;
    }

    public void setAmountProduct(Integer amountProduct) {
        this.amountProduct = amountProduct;
    }
}

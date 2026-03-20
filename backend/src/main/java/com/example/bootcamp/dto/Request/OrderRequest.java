package com.example.bootcamp.dto.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class OrderRequest {

    @NotBlank(message = "ชื่อลูกค้าห้ามว่าง")
    private String customerName;

    @NotBlank(message = "เบอร์โทรศัพท์ลูกห้ามว่าง")
    private String customerPhone;

    @NotBlank(message = "ที่อยู่ลูกค้าห้ามว่าง")
    private String customerAddress;

    @NotEmpty(message = "รายการสินค้าห้ามว่าง")
    private List<OrderItemRequest> items;

    private java.math.BigDecimal totalAmount;

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerAddress() { return customerAddress; }
    public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public java.math.BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(java.math.BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}

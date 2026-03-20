package com.example.bootcamp.dto.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ResellerAuthRequest {

    @NotBlank(message = "ชื่อ - นามสกุลห้ามว่าง")
    private String name;

    @NotBlank(message = "อีเมลห้ามว่าง")
    private String email;

    @NotBlank(message = "เบอร์โทรศัพท์มือถือห้ามว่าง")
    @Pattern(regexp = "^\\d{10}$")
    private String phone;

    @NotBlank(message = "รหัสผ่านห้ามว่าง")
    @Size(min = 8, message = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    private String password;

    @NotBlank(message = "ยืนยันรหัสผ่านห้ามว่าง")
    private String confirmPassword;

    @NotBlank(message = "ชื่อร้านค้าห้ามว่าง")
    private String shopName;

    @NotBlank(message = "ที่อยู่ห้ามว่าง")
    private String address;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}

package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.ProductRequest;
import com.example.bootcamp.dto.Request.UpdateOrderStatusRequest;
import com.example.bootcamp.dto.Response.AdminOrderResponse;
import com.example.bootcamp.entity.OrdersEntity;
import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.service.AdminService;
import com.example.bootcamp.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")

public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AdminService adminService;

    @GetMapping("/products")
    public ResponseEntity<List<ProductsEntity>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/products/add")
    public ResponseEntity<String> addProducts(@Valid @RequestBody ProductRequest request) {
        String result = productService.addProduct(request);

        if (result.contains("สำเร็จ")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PutMapping("/products/edit/{id}")
    public ResponseEntity<String> editProducts(
            @PathVariable Integer id,
            @Valid @RequestBody ProductRequest request
    ) {
        String result = productService.editProduct(id, request);

        if ("แก้ไขสำเร็จ".equals(result)) {
            return ResponseEntity.ok(result);
        } else if ("ไม่พบสินค้านี้ในระบบ".equals(result)) {
            return ResponseEntity.status(404).body(result); // แนะนำให้ส่ง 404 ถ้าหาไม่เจอ
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @DeleteMapping("/products/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        try {
            String message = productService.deleteProduct(id);
            if (message.equals("ลบสินค้าสำเร็จ")) {
                return ResponseEntity.ok(message);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderResponse>> getAllOrder() {
        List<AdminOrderResponse> adminOrderResponses = adminService.getAllOrder();
        return ResponseEntity.ok(adminOrderResponses);
    }

    @PostMapping("/orders/status")
    public ResponseEntity<String> updateOrderStatus(
            @Valid @RequestBody UpdateOrderStatusRequest request,
            @RequestParam OrdersEntity.Status status) {
        try {
            String message = adminService.updateOrderStatus(request.getOrderId(), status);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<com.example.bootcamp.dto.Response.AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStatistics());
    }
}
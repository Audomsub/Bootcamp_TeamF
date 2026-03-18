package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.UpdateOrderStatusRequest;
import com.example.bootcamp.dto.Response.AdminOrderResponse;
import com.example.bootcamp.entity.OrdersEntity;
import com.example.bootcamp.service.AdminService;
import com.example.bootcamp.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminOrderController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AdminService adminService;

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
}

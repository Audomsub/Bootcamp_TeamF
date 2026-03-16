package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.AdminOrderResponse;
import com.example.bootcamp.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminOrderController {
    @Autowired
    private AdminService adminService;

    @GetMapping("orders")
    public ResponseEntity<List<AdminOrderResponse>> getAllOrder() {
        List<AdminOrderResponse> adminOrderResponses = adminService.getAllOrder();
        return ResponseEntity.ok(adminOrderResponses);
    }
}

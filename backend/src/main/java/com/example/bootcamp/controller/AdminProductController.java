package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.ProductRequest;
import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")

public class AdminProductController {

    @Autowired
    private ProductService productService;

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
            @PathVariable Long id,                             // รับ id จาก URL
            @Valid @RequestBody ProductRequest request        // รับ JSON จาก Body มาใส่ใน request
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
}
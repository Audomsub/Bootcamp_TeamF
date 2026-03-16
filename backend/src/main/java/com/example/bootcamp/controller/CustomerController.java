package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.OrderRequest;
import com.example.bootcamp.dto.Response.ShopFrontResponse;
import com.example.bootcamp.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/shop/{slug}")
    public ResponseEntity<?> getShopDetail(@PathVariable String slug) {
        ShopFrontResponse shopFrontResponse = customerService.getShopFront(slug);
        if (shopFrontResponse == null) {
            return ResponseEntity.status(404).body("ไม่พบร้านค้านนี้");
        }
        return ResponseEntity.ok(shopFrontResponse);
    }

    @PostMapping("/shop/{slug}/checkout")
    public ResponseEntity<String> checkout(@PathVariable String slug , @Valid @RequestBody OrderRequest orderRequest) {
        String result = customerService.createOrder(slug , orderRequest);
        if (result.contains("สำเร็จ")) {
            return ResponseEntity.ok(result);
        } else  {
            return ResponseEntity.badRequest().body(result);
        }
    }
}

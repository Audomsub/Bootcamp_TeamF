package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.OrderRequest;
import com.example.bootcamp.dto.Response.ShopFrontResponse;
import com.example.bootcamp.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class CustomerController {

    @Autowired
    private CustomerService customerService;



    @GetMapping("/shop/{slug}")
    public ResponseEntity<?> getShopDetail(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        
        Sort sort = Sort.by(Sort.Direction.DESC, "product.stock").and(Sort.by(Sort.Direction.ASC, "id"));
        Pageable pageable = PageRequest.of(page, size, sort);
        ShopFrontResponse shopFrontResponse = customerService.getShopFront(slug, pageable);
        
        if (shopFrontResponse == null) {
            return ResponseEntity.status(404).body("ไม่พบร้านค้านี้");
        }
        return ResponseEntity.ok(shopFrontResponse);
    }

    @PostMapping("/shop/{slug}/checkout")
    public ResponseEntity<?> checkout(@PathVariable String slug, @Valid @RequestBody OrderRequest orderRequest) {
        try {
            com.example.bootcamp.entity.OrdersEntity order = customerService.createOrder(slug, orderRequest);
            java.util.Map<String, Object> data = new java.util.HashMap<>();
            data.put("id", order.getId());
            data.put("orderNumber", order.getOrderNumber());
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/shop/{slug}/order/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable String slug, @PathVariable Integer orderId) {
        try {
            com.example.bootcamp.dto.Response.OrderDetailResponse response = customerService.getOrderDetails(orderId);
            return ResponseEntity.ok(java.util.Map.of("data", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/shop/{slug}/payment/{orderId}")
    public ResponseEntity<String> simulatePayment(@PathVariable String slug, @PathVariable Integer orderId) {
        try {
            String result = customerService.simulatePayment(slug, orderId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/track-order")
    public ResponseEntity<?> trackOrder(@RequestParam String orderNumber) {
        try {
            com.example.bootcamp.dto.Response.TrackOrderResponse response = customerService.trackOrder(orderNumber);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/catalog")
    public ResponseEntity<org.springframework.data.domain.Page<com.example.bootcamp.entity.ProductsEntity>> getCatalog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());
        return ResponseEntity.ok(customerService.getAllCatalog(pageable));
    }

    @GetMapping("/shop")
    public ResponseEntity<?> getShops() {
        return ResponseEntity.ok(customerService.getAllShops());
    }

    @GetMapping("/shops2")
    public ResponseEntity<?> getShops2() {
        return ResponseEntity.ok(customerService.getAllShopWithProducts());
    }
    
}

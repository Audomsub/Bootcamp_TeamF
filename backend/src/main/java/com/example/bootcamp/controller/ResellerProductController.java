package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.ResellerProductResponse;
import com.example.bootcamp.service.ResellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/reseller/products")
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class ResellerProductController {

    @Autowired
    private ResellerService resellerService;

    @GetMapping
    public ResponseEntity<?> getMyProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("กรุณาเข้าสู่ระบบ");
        }

        try {
            String email = authentication.getName();
            Pageable pageable = PageRequest.of(page, size);
            Page<ResellerProductResponse> result = resellerService.getMyProducts(email, pageable);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updatePrice(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        try {
            BigDecimal price = new BigDecimal(body.get("selling_price").toString());
            resellerService.updateProductPrice(authentication.getName(), id, price);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeProduct(
            @PathVariable Integer id,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        try {
            resellerService.removeProductFromShop(authentication.getName(), id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

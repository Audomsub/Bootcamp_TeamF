package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.ResellerCatalogRequest;
import com.example.bootcamp.dto.Response.ResellerCatalogResponse;
import com.example.bootcamp.service.ResellerService;
// แก้ไข Import เป็นของ Spring Security โดยตรง
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reseller/catalog")
public class ResellerCatalogController {

    @Autowired
    private ResellerService resellerService;

    @GetMapping
    public ResponseEntity<?> getCatalog(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("กรุณาเข้าสู่ระบบ");
        }

        String name = authentication.getName();
        List<ResellerCatalogResponse> result = resellerService.getCentralCatalogByUsername(name);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/select")
    public ResponseEntity<String> selectProduct(
            @RequestBody ResellerCatalogRequest request,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("กรุณาเข้าสู่ระบบ");
        }
        String name = authentication.getName();
        String message = resellerService.selectProductToShop(name, request);
        if (message.contains("สำเร็จ")) {
            return ResponseEntity.ok(message);
        }
        return ResponseEntity.badRequest().body(message);
    }
}
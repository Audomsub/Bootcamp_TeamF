package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.ResellerDashboardResponse;
import com.example.bootcamp.service.ResellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reseller/dashboard")
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class ResellerDashboardController {

    @Autowired
    private ResellerService resellerService;

    @GetMapping
    public ResponseEntity<?> getDashboardStats(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("กรุณาเข้าสู่ระบบ");
        }
        try {
            String email = authentication.getName();
            ResellerDashboardResponse stats = resellerService.getResellerDashboardStats(email);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}

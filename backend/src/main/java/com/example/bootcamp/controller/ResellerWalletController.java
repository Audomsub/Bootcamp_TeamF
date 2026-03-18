package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.ResellerWalletResponse;
import com.example.bootcamp.service.ResellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reseller")
public class ResellerWalletController {

    @Autowired
    private ResellerService resellerService;

    @GetMapping("/wallet")
    public ResponseEntity<ResellerWalletResponse> getWallet(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ResellerWalletResponse response = resellerService.getWalletDetails(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<com.example.bootcamp.dto.Response.ResellerDashboardResponse> getDashboard(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        com.example.bootcamp.dto.Response.ResellerDashboardResponse response = resellerService.getDashboardData(authentication.getName());
        return ResponseEntity.ok(response);
    }
}

package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.ResellerWalletResponse;
import com.example.bootcamp.service.ResellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reseller/wallet")
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class ResellerWalletController {

    @Autowired
    private ResellerService resellerService;

    @GetMapping
    public ResponseEntity<ResellerWalletResponse> getWallet(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // General info - first page
        ResellerWalletResponse response = resellerService.getWalletDetails(authentication.getName(), PageRequest.of(0, 10));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/logs")
    public ResponseEntity<ResellerWalletResponse> getWalletLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Pageable pageable = PageRequest.of(page, size);
        ResellerWalletResponse response = resellerService.getWalletDetails(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }
}

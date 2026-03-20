package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.ResellerOrderResponse;
import com.example.bootcamp.service.ResellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reseller/orders")
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class ResellerOrderController {

    @Autowired
    private ResellerService resellerService;

    @GetMapping
    public ResponseEntity<Page<ResellerOrderResponse>> getMyOrder(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String email = authentication.getName();
            Pageable pageable = PageRequest.of(page, size);
            Page<ResellerOrderResponse> orderResponses = resellerService.getMyOrder(email, pageable);
            return ResponseEntity.ok(orderResponses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

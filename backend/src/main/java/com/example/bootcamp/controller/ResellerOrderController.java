package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.ResellerOrderResponse;
import com.example.bootcamp.service.ResellerService;
import org.springframework.security.core.Authentication; // ตัวนี้คือของจริง มี getName() แน่นอน
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reseller/orders")
public class ResellerOrderController {
    @Autowired
    private ResellerService resellerService;

    @GetMapping
    public ResponseEntity<List<ResellerOrderResponse>> getMyOrder(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            List<ResellerOrderResponse> orderResponses = resellerService.getMyOrder(authentication.getName());
            return ResponseEntity.ok(orderResponses);
        } catch (Exception e) {
            e.printStackTrace();
            List<ResellerOrderResponse> errorList = new java.util.ArrayList<>();
            errorList.add(new ResellerOrderResponse(null, e.getMessage(), null, null, null, null));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorList);
        }
    }
}

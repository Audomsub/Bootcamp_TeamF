package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.ResellerCatalogRequest;
import com.example.bootcamp.service.ResellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Security;

@RestController("/reseller/catalog")
public class ResellerCatalogController {

    @Autowired
    private ResellerService resellerService;

    @GetMapping
    public ResponseEntity<?> getCatalog() {
        return ResponseEntity.ok(resellerService.getCentralCatalog());
    }

//    @PostMapping("/select")
//    public ResponseEntity<String> selectProducts(@RequestBody ResellerCatalogRequest resellerCatalogRequest) {
//        Integer userId = S
//    }
}

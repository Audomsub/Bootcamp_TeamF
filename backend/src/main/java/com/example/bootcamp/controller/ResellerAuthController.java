package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.ResellerAuthRequest;
import com.example.bootcamp.dto.Response.AdminLoginResponse;
import com.example.bootcamp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/")
public class ResellerAuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody ResellerAuthRequest request) {
        String result = authService.resellerRegister(request);
        if ("สมัครสำเร็จ กรุณารอการอนุมัติจาก Admin".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody Map<String, String> loginRequest) {
        // ดึงค่าจาก JSON body
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        AdminLoginResponse response = authService.authenticate(email, password);
        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(response);
    }
}

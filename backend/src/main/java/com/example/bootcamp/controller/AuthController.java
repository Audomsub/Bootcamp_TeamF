package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.ResellerAuthRequest;
import com.example.bootcamp.dto.Response.AdminLoginResponse;
import com.example.bootcamp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Unified Authentication Controller
 * Handles login for ALL roles (Admin, Reseller) via a single /login endpoint.
 * After login, the response contains the user's role so the frontend can redirect accordingly.
 *
 * POST /login   - Unified login (Admin, Reseller)
 * POST /register - Reseller registration
 */
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Unified login endpoint for all roles.
     * Returns token + role so the frontend can redirect to the correct dashboard.
     */
    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        AdminLoginResponse response = authService.authenticate(email, password);

        if (response != null && response.getToken() != null) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                response != null ? response : AdminLoginResponse.builder().message("อีเมลหรือรหัสผ่านไม่ถูกต้อง").build()
        );
    }

    /**
     * Reseller registration endpoint.
     * After registration, the reseller must wait for Admin approval.
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody ResellerAuthRequest request) {
        String result = authService.resellerRegister(request);
        if ("สมัครสำเร็จ กรุณารอการอนุมัติจาก Admin".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}

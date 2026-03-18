package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.AdminLoginResponse;
import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.service.AdminService;
import com.example.bootcamp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminAuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody Map<String , String> loginRequest) {

        AdminLoginResponse response = authService.authenticate(loginRequest.get("email") , loginRequest.get("password"));

        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AdminLoginResponse.builder().message("อีเมลหรือรหัสผ่านไม่ถูกต้อง").build());
    }

    @GetMapping("/resellers")
    public ResponseEntity<List<UsersEntity>> getReseller() {
        return ResponseEntity.ok(adminService.getAllReseller());
    }

    @PostMapping("/reseller/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Integer id , @RequestParam UsersEntity.Status status) {
        return ResponseEntity.ok(adminService.updateResellerStatus(id , status));
    }
}

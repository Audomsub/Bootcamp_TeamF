package com.example.bootcamp.controller;

import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminResellerController {


    @Autowired
    private AdminService adminService;

    @GetMapping("/resellers")
    public ResponseEntity<List<UsersEntity>> getReseller() {
        return ResponseEntity.ok(adminService.getAllReseller());
    }

    @PostMapping("/reseller/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Integer id , @RequestParam UsersEntity.Status status) {
        return ResponseEntity.ok(adminService.updateResellerStatus(id , status));
    }
}

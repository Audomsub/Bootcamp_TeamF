package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Response.AdminResellerResponse;
import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin Reseller Management Controller
 * Handles: listing resellers, approving, rejecting
 *
 * GET  /admin/resellers             - List all resellers with their status
 * POST /admin/reseller/{id}/status  - Approve or reject a reseller
 */
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class AdminResellerController {

    @Autowired
    private AdminService adminService;

    /**
     * List all resellers (pending first, then approved, then rejected).
     */
    @GetMapping("/resellers")
    public ResponseEntity<List<AdminResellerResponse>> getAllResellers() {
        return ResponseEntity.ok(adminService.getAllReseller());
    }

    /**
     * Approve or reject a reseller by updating their status.
     * @param id     the reseller's user ID
     * @param status approved | rejected | pending
     */
    @PostMapping("/reseller/{id}/status")
    public ResponseEntity<String> updateResellerStatus(
            @PathVariable Integer id,
            @RequestParam UsersEntity.Status status) {
        return ResponseEntity.ok(adminService.updateResellerStatus(id, status));
    }
}

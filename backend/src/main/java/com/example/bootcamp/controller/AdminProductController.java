package com.example.bootcamp.controller;

import com.example.bootcamp.dto.Request.ProductRequest;
import com.example.bootcamp.dto.Request.UpdateOrderStatusRequest;
import com.example.bootcamp.dto.Response.AdminDashboardResponse;
import com.example.bootcamp.dto.Response.AdminOrderResponse;
import com.example.bootcamp.entity.OrdersEntity;
import com.example.bootcamp.service.AdminService;
import com.example.bootcamp.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin Product & Order Management Controller
 *
 * Products:
 *   GET    /admin/products            - List all products (paginated)
 *   POST   /admin/products/add        - Add a new product (multipart/form-data)
 *   PUT    /admin/products/edit/{id}  - Edit a product (multipart/form-data)
 *   DELETE /admin/products/delete/{id} - Delete a product
 *
 * Orders:
 *   GET  /admin/orders         - List all orders (paginated)
 *   POST /admin/orders/status  - Update order status (e.g. → shipped)
 *
 * Dashboard:
 *   GET  /admin/dashboard      - Summary statistics
 */
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AdminService adminService;

    // ─── Products ────────────────────────────────────────────────────────────

    @GetMapping("/products")
    public ResponseEntity<Page<com.example.bootcamp.entity.ProductsEntity>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(productService.getAllProductsPaginated(pageable));
    }

    @PostMapping(value = "/products/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addProduct(@Valid @ModelAttribute ProductRequest request) {
        String result = productService.addProduct(request);
        if (result.contains("สำเร็จ")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PutMapping(value = "/products/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> editProduct(
            @PathVariable Integer id,
            @Valid @ModelAttribute ProductRequest request) {
        String result = productService.editProduct(id, request);
        if ("แก้ไขสำเร็จ".equals(result)) {
            return ResponseEntity.ok(result);
        } else if ("ไม่พบสินค้านี้ในระบบ".equals(result)) {
            return ResponseEntity.status(404).body(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @DeleteMapping("/products/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        try {
            String message = productService.deleteProduct(id);
            if ("ลบสินค้าสำเร็จ".equals(message)) {
                return ResponseEntity.ok(message);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ─── Orders ──────────────────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<Page<AdminOrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getAllOrder(pageable));
    }

    @PostMapping("/orders/status")
    public ResponseEntity<String> updateOrderStatus(
            @RequestBody UpdateOrderStatusRequest request,
            @RequestParam(name = "status") String status) {
        try {
            OrdersEntity.Status orderStatus = OrdersEntity.Status.valueOf(status.toLowerCase());
            String message = adminService.updateOrderStatus(request.getOrderId(), orderStatus);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("สถานะไม่ถูกต้อง: " + status);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ─── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStatistics());
    }
}
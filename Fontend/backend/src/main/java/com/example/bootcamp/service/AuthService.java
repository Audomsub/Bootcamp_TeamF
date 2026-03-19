package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.ResellerAuthRequest;
import com.example.bootcamp.dto.Response.AdminLoginResponse;
import com.example.bootcamp.dto.Response.UserInfo;
import com.example.bootcamp.dto.Response.ShopInfo;
import com.example.bootcamp.entity.ShopsEntity;
import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.entity.WalletsEntity;
import com.example.bootcamp.repository.ShopRepository;
import com.example.bootcamp.repository.UserRepository;
import com.example.bootcamp.repository.WalletRepository;
import com.example.bootcamp.utill.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * AuthService handles:
 * 1. Unified authentication (Admin + Reseller) via authenticate()
 * 2. Reseller registration via resellerRegister()
 *
 * Login flow:
 * - Looks up user by email in the DB
 * - Verifies password (BCrypt, with plain-text fallback for legacy data)
 * - For resellers: checks status (pending → rejected cannot log in)
 * - Returns JWT token + role in the response for frontend routing
 */
@Service
public class AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * Authenticate a user by email and password.
     * Works for both Admin and Reseller roles.
     * Returns a response with a JWT token if successful, or an error message
     * otherwise.
     */
    public AdminLoginResponse authenticate(String email, String password) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    // ── Step 1: Verify password ──────────────────────────────────
                    boolean passwordMatches = false;
                    try {
                        passwordMatches = bCryptPasswordEncoder.matches(password, user.getPassword());
                    } catch (Exception ignored) {
                        // BCrypt may throw if hash is malformed
                    }
                    // Fallback: plain-text comparison (for seeded/legacy accounts)
                    if (!passwordMatches && password.equals(user.getPassword())) {
                        passwordMatches = true;
                    }

                    if (!passwordMatches) {
                        return AdminLoginResponse.builder()
                                .message("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
                                .build();
                    }

                    // ── Step 2: Role-specific checks ─────────────────────────────
                    String roleName = user.getRole().name().toUpperCase();

                    if (UsersEntity.Role.reseller.equals(user.getRole())) {
                        // Reseller must be approved to log in
                        if (UsersEntity.Status.pending.equals(user.getStatus())) {
                            return AdminLoginResponse.builder()
                                    .message("บัญชีรออนุมัติ กรุณารอการติดต่อจาก Admin")
                                    .build();
                        }
                        if (UsersEntity.Status.rejected.equals(user.getStatus())) {
                            return AdminLoginResponse.builder()
                                    .message("บัญชีนี้ไม่ได้รับการอนุมัติ")
                                    .build();
                        }
                    }

                    // ── Step 3: Generate token & build response ───────────────────
                    String token = jwtUtil.generateToken(email, roleName);

                    AdminLoginResponse.AdminLoginResponseBuilder builder = AdminLoginResponse.builder()
                            .token(token)
                            .email(email)
                            .role(roleName)
                            .message("เข้าสู่ระบบสำเร็จ")
                            .user(UserInfo.builder()
                                    .id(user.getId())
                                    .name(user.getName())
                                    .email(user.getEmail())
                                    .role(roleName)
                                    .build());

                    // For resellers, also include shop information
                    if ("RESELLER".equals(roleName)) {
                        shopRepository.findByUserId(user.getId()).ifPresent(shop -> builder.shop(ShopInfo.builder()
                                .id(shop.getId())
                                .shopName(shop.getShopName())
                                .shopSlug(shop.getShopSlug())
                                .build()));
                    }

                    return builder.build();
                })
                .orElse(AdminLoginResponse.builder()
                        .message("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
                        .build());
    }

    /**
     * Register a new Reseller.
     * Creates the user, shop, and wallet records.
     * Initial status is 'pending' (requires Admin approval).
     */
    @Transactional
    public String resellerRegister(ResellerAuthRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return "อีเมลนี้ถูกใช้งานแล้ว";
        }

        if (shopRepository.existsByShopName(request.getShopName())) {
            return "ชื่อร้านนี้ถูกใช้แล้ว";
        }

        // Create user
        UsersEntity user = new UsersEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        user.setRole(UsersEntity.Role.reseller);
        user.setStatus(UsersEntity.Status.pending);
        user.setAddress(request.getAddress());
        UsersEntity savedUser = userRepository.save(user);

        // Create shop — slug is lowercase, spaces replaced with hyphens
        ShopsEntity shop = new ShopsEntity();
        shop.setShopName(request.getShopName());
        String slug = request.getShopName().toLowerCase().trim().replaceAll("[^a-z0-9]+", "-");
        shop.setShopSlug(slug);
        shop.setUser(savedUser);
        shopRepository.save(shop);

        // Create wallet (starts with zero balance)
        WalletsEntity wallet = new WalletsEntity();
        wallet.setUser(savedUser);
        wallet.setBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);

        return "สมัครสำเร็จ กรุณารอการอนุมัติจาก Admin";
    }
}

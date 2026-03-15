package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.ResellerAuthRequest;
import com.example.bootcamp.dto.Response.AdminLoginResponse;
import com.example.bootcamp.entity.ShopsEntity;
import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.entity.WalletsEntity;
import com.example.bootcamp.repository.ShopRepository;
import com.example.bootcamp.repository.UserRepository;
import com.example.bootcamp.repository.WalletRepository;
import com.example.bootcamp.utill.JwtUtill;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {
    @Autowired
    private JwtUtill jwtUtill;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public AdminLoginResponse authenticate(String email, String password) {
        if ("admin@gmail.com".equals(email) && "admin123456".equals(password)) {
            String token = jwtUtill.generateToken(email, "ADMIN");
            return AdminLoginResponse.builder()
                    .token(token)
                    .email(email)
                    .role("ADMIN")
                    .message("เข้าสู่ระบบสำเร็จ")
                    .build();
        }
        return userRepository.findByEmail(email)
                .map(user -> {
                    // 1. ตรวจสอบรหัสผ่าน (ใช้ BCrypt)
                    if (bCryptPasswordEncoder.matches(password, user.getPassword())) {

                        // 2. ถ้าเป็น Role "reseller" ต้องตรวจสอบสถานะการอนุมัติ
                        // ใช้ .name().equalsIgnoreCase() เพื่อป้องกันปัญหา String vs Enum และตัวพิมพ์เล็ก/ใหญ่
                        if ("reseller".equalsIgnoreCase(user.getRole().name())) {

                            if ("pending".equalsIgnoreCase(user.getStatus().name())) {
                                return AdminLoginResponse.builder()
                                        .message("บัญชีรออนุมัติ กรุณารอการติดต่อ")
                                        .build();
                            }

                            if ("rejected".equalsIgnoreCase(user.getStatus().name())) {
                                return AdminLoginResponse.builder()
                                        .message("บัญชีนี้ไม่ได้รับการอนุมัติ")
                                        .build();
                            }
                        }

                        String roleName = user.getRole().name().toUpperCase();
                        String token = jwtUtill.generateToken(email, roleName);

                        return AdminLoginResponse.builder()
                                .token(token)
                                .email(email)
                                .role(roleName) // ส่ง Role กลับไปให้ Frontend จัดการหน้า UI
                                .message("เข้าสู่ระบบสำเร็จ") // (BR-15)
                                .build();
                    }

                    // กรณีรหัสผ่านไม่ตรงกัน (BR-18)
                    return AdminLoginResponse.builder()
                            .message("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
                            .build();
                })
                // กรณีหาอีเมลนี้ไม่เจอในระบบ (BR-18)
                .orElse(AdminLoginResponse.builder()
                        .message("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
                        .build());
    }

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

        UsersEntity usersEntity = new UsersEntity();
        usersEntity.setName(request.getName());
        usersEntity.setEmail(request.getEmail());
        usersEntity.setPhone(request.getPhone());
        usersEntity.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        usersEntity.setRole(UsersEntity.Role.reseller);
        usersEntity.setStatus(UsersEntity.Status.pending);
        usersEntity.setAddress(request.getAddress());
        UsersEntity savedUser = userRepository.save(usersEntity);

        ShopsEntity shopsEntity = new ShopsEntity();
        shopsEntity.setShopName(request.getShopName());
        String slug = request.getShopName().toLowerCase().trim().replaceAll("[^a-z0-9]+", "-");
        shopsEntity.setShopSlug(slug);
        shopsEntity.setUser(savedUser);
        shopRepository.save(shopsEntity);

        WalletsEntity walletsEntity = new WalletsEntity();
        walletsEntity.setUser(savedUser);
        walletsEntity.setBalance(BigDecimal.ZERO);
        walletRepository.save(walletsEntity);

        return "สมัครสำเร็จ กรุณารอการอนุมัติจาก Admin";
    }
}

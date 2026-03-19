package com.example.bootcamp.config;

import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataInitializer - สร้าง Admin account เริ่มต้นเมื่อ startup ถ้ายังไม่มี
 *
 * Default Admin credentials:
 *   Email:    admin@bootcamp.com
 *   Password: admin123456
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@bootcamp.com";

        try {
            if (userRepository.existsByEmail(adminEmail)) {
                System.out.println("=== Admin account already exists: " + adminEmail + " ===");
                return;
            }

            UsersEntity admin = new UsersEntity();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(bCryptPasswordEncoder.encode("admin123456"));
            admin.setRole(UsersEntity.Role.admin);
            admin.setStatus(UsersEntity.Status.approved);
            admin.setPhone("0000000000");
            admin.setAddress("System");

            userRepository.save(admin);
            System.out.println("=== Default Admin account created: " + adminEmail + " ===");

        } catch (Exception e) {
            // ถ้า insert ไม่ได้ (เช่น sequence conflict) ให้ log แล้วข้ามไป ไม่ให้ app crash
            System.out.println("=== Admin already exists in DB (skipping creation): " + e.getMessage() + " ===");
        }
    }
}

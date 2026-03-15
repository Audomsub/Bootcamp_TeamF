package com.example.bootcamp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity // เพิ่ม Annotation นี้เพื่อเปิดใช้งาน Web Security
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // ปิด CSRF เพราะเราใช้ JWT (Stateless)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // บอก Spring ไม่ต้องสร้าง Session
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/admin/login").permitAll() // อนุญาตให้ Login ได้โดยไม่ต้องมี Token
                        .requestMatchers("/admin/**").authenticated() // ทุกอย่างที่ขึ้นต้นด้วย /admin ต้อง Login (มี Token)
                        .anyRequest().permitAll() // URL อื่นๆ นอกจากนี้ปล่อยผ่านหมด
                )
                // วาง JwtFilter ไว้ก่อน Filter หลักของ Spring เพื่อตรวจ Token ก่อน
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
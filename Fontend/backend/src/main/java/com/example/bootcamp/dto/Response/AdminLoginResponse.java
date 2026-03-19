package com.example.bootcamp.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminLoginResponse {
    private String token;
    private String email;
    private String role;
    private String message;
    private UserInfo user;
    private ShopInfo shop;
}

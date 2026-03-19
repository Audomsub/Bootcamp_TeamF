package com.example.bootcamp.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminResellerResponse {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String status;
    private LocalDateTime created_at;
    private ShopInfo shop;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShopInfo {
        private String shop_name;
    }
}

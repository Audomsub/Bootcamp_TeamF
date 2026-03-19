package com.example.bootcamp.dto.Response;

import com.example.bootcamp.entity.ShopProductsEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResellerProductResponse {
    private Integer id;
    
    @JsonProperty("selling_price")
    private BigDecimal sellingPrice;
    
    private ProductDetail product;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductDetail {
        private Integer id;
        private String name;
        
        @JsonProperty("image_url")
        private String imageUrl;
        
        @JsonProperty("min_price")
        private BigDecimal minPrice;
        
        @JsonProperty("cost_price")
        private BigDecimal costPrice;
    }

    public static ResellerProductResponse fromEntity(ShopProductsEntity entity) {
        return ResellerProductResponse.builder()
                .id(entity.getId())
                .sellingPrice(entity.getSellingPrice())
                .product(ProductDetail.builder()
                        .id(entity.getProduct().getId())
                        .name(entity.getProduct().getProductName())
                        .imageUrl(entity.getProduct().getImageUrl())
                        .minPrice(entity.getProduct().getMinSellPrice())
                        .costPrice(entity.getProduct().getCostPrice())
                        .build())
                .build();
    }
}

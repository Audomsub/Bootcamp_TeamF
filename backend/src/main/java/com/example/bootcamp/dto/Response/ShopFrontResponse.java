package com.example.bootcamp.dto.Response;

import java.util.List;

public class ShopFrontResponse {

    private String shopName;

    private List<ShopProductResponse> productResponses;

    public ShopFrontResponse(String shopName , List<ShopProductResponse> shopProductResponses){
        this.shopName = shopName;
        this.productResponses = shopProductResponses;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public List<ShopProductResponse> getProductResponses() {
        return productResponses;
    }

    public void setProductResponses(List<ShopProductResponse> productResponses) {
        this.productResponses = productResponses;
    }
}

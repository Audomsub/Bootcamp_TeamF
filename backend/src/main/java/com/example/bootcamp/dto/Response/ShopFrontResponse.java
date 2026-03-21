package com.example.bootcamp.dto.Response;

import java.util.List;

public class ShopFrontResponse {

    private String shopName;
    private String resellerEmail;
    private List<ShopProductResponse> productResponses;
    private int totalPages;
    private long totalElements;
    private int currentPage;

    public ShopFrontResponse(String shopName, String resellerEmail, List<ShopProductResponse> shopProductResponses, int totalPages, long totalElements, int currentPage) {
        this.shopName = shopName;
        this.resellerEmail = resellerEmail;
        this.productResponses = shopProductResponses;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
    }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public String getResellerEmail() { return resellerEmail; }
    public void setResellerEmail(String resellerEmail) { this.resellerEmail = resellerEmail; }
    public List<ShopProductResponse> getProductResponses() { return productResponses; }
    public void setProductResponses(List<ShopProductResponse> productResponses) { this.productResponses = productResponses; }
    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
    public int getCurrentPage() { return currentPage; }
    public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }
}

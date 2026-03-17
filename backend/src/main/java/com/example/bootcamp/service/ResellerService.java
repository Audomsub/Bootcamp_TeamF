package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.ResellerCatalogRequest;
import com.example.bootcamp.dto.Response.ResellerCatalogResponse;
import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.entity.ShopProductsEntity;
import com.example.bootcamp.entity.ShopsEntity;
import com.example.bootcamp.repository.ProductRepository;
import com.example.bootcamp.repository.ShopProductRepository;
import com.example.bootcamp.repository.ShopRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ResellerService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopProductRepository shopProductRepository;

    @Autowired
    private ShopRepository shopRepository;

    public List<ResellerCatalogResponse> getCentralCatalog() {
        List<ProductsEntity> productsEntityList = productRepository.findAll();
        List<ResellerCatalogResponse> resellerCatalogResponses = new ArrayList<>();

        for (ProductsEntity product : productsEntityList) {
            ResellerCatalogResponse resellerCatalogResponse = new ResellerCatalogResponse();

            resellerCatalogResponse.setId(product.getId());
            resellerCatalogResponse.setName(product.getProductName());
            resellerCatalogResponse.setImageUrl(product.getImageUrl());
            resellerCatalogResponse.setCostPrice(product.getCostPrice());
            resellerCatalogResponse.setMinPrice(product.getMinSellPrice());
            resellerCatalogResponse.setStock(product.getStock());

            resellerCatalogResponses.add(resellerCatalogResponse);
        }

        // 3. ส่งข้อมูลทั้งหมดกลับไป
        return resellerCatalogResponses;
    }

    @Transactional
    public String selectProductToShop(Integer userId, ResellerCatalogRequest resellerCatalogRequest) {

        ShopsEntity shopsEntity = shopRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบร้านของคุณ"));
        ProductsEntity productsEntity = productRepository.findById(resellerCatalogRequest.getProductId()).orElseThrow(() -> new RuntimeException("ไม่พบสินค้าในระบบ"));
        if (productsEntity.getStock() <= 0) {
            return "สินค้าหมด ไม่สามารถเพิ่มเข้าร้านได้";
        }
        if (resellerCatalogRequest.getSellingPrice().compareTo(productsEntity.getCostPrice()) < 0) {
            return "ราคาขายต้องไม่น้อยกว่าราคาขั้นต่ำ (" + productsEntity.getMinSellPrice() + ")";
        }

        Optional<ShopProductsEntity> existing = shopProductRepository.findByShopIdAndProductId(shopsEntity.getId(), productsEntity.getId());

        if (existing.isPresent()) {

            ShopProductsEntity shopProductsEntity = existing.get();
            shopProductsEntity.setSellingPrice(resellerCatalogRequest.getSellingPrice());

            shopProductRepository.save(shopProductsEntity);

            return "อัปเดตราคาสินค้าในร้านสำเร็จ";

        } else {

            ShopProductsEntity shopProductsEntity = new ShopProductsEntity();
            shopProductsEntity.setShop(shopsEntity);
            shopProductsEntity.setProduct(productsEntity);
            shopProductsEntity.setSellingPrice(resellerCatalogRequest.getSellingPrice());

            shopProductRepository.save(shopProductsEntity);

            return "เพิ่มข้อมูลเข้าร้านค้าสำเร็จ";
        }
    }
}
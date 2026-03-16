package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.ProductRequest;
import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public String addProduct(ProductRequest request) {
        if ((request.getMinSellPrice().compareTo(request.getCostPrice()) < 0)) {
            return "ราคาขายขั้นต่ำต้อง >= ราคาทุน";
        }
        ProductsEntity productsEntity = new ProductsEntity();
        productsEntity.setProductName((request.getProductName()));
        productsEntity.setImageUrl(request.getImageUrl());
        productsEntity.setDescription(request.getDescription());
        productsEntity.setCostPrice(request.getCostPrice());
        productsEntity.setMinSellPrice(request.getMinSellPrice());
        productsEntity.setStock(request.getStock());

        productRepository.save(productsEntity);
        return "เพิ่มสินค้าสำเร็จแล้ว";
    }

    public List<ProductsEntity> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional
    public String editProduct(Long id , ProductRequest request) {
        Optional<ProductsEntity> optionalProductsEntity = productRepository.findById(id);
        if (optionalProductsEntity.isEmpty()) {
            return "ไม่พบสินค้านี้ในระบบ";
        }
        if (request.getMinSellPrice() == null || request.getCostPrice() == null) {
            return "ข้อมูลราคาไม่ครบถ้วน";
        }

        if (request.getMinSellPrice().compareTo(request.getCostPrice()) < 0) {
            return "ราคาขายต้องไม่น้อยกว่าราคาทุน";
        }
        ProductsEntity productsEntity = optionalProductsEntity.get();

        // เซตค่าใหม่ทับลงไป
        productsEntity.setProductName(request.getProductName());
        productsEntity.setImageUrl(request.getImageUrl());
        productsEntity.setDescription(request.getDescription());
        productsEntity.setCostPrice(request.getCostPrice());
        productsEntity.setMinSellPrice(request.getMinSellPrice());
        productsEntity.setStock(request.getStock());

        productRepository.save(productsEntity);
        return "แก้ไขสำเร็จ";
    }
}

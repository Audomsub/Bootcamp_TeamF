package com.example.bootcamp.service;

import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public String addProduct(ProductsEntity productsEntity) {
        if ((productsEntity.getMinPrice().compareTo(productsEntity.getCostPrice()) < 0)) {
            return "ราคาขายขั้นต่ำต้อง >= ราคาทุน";
        }
        productRepository.save(productsEntity);
        return "Add สินค้าสำเร็จ";
    }

    public List<ProductsEntity> getAllProducts() {
        return productRepository.findAll();
    }
}

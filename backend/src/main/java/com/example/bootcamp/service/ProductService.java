package com.example.bootcamp.service;

import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public String addProduct(ProductsEntity productsEntity) {
        if ((productsEntity.getMinPrice().compareTo(productsEntity.getCostPrice()) < 0)) {
            return "ราคาขายขั้น"
        }
    }
}

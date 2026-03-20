package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.entity.ShopsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductsEntity, Integer> {

}

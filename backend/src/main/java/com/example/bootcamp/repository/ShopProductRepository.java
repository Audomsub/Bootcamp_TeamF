package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ShopProductsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopProductRepository extends JpaRepository<ShopProductsEntity, Long> {
    List<ShopProductsEntity> findByShopId(Long shopId); // ดึงสินค้าทั้งหมดในร้านของตัวแทนคนนี้
    Optional<ShopProductsEntity> findByShopIdAndProductId(Long shopId, Long productId); // เช็กว่าร้านนี้มีสินค้านี้หรือยัง
    boolean existsByShopIdAndProductId(Long shopId, Long productId);
}

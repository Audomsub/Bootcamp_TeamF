package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ShopProductsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopProductRepository extends JpaRepository<ShopProductsEntity, Long> {
    List<ShopProductsEntity> findByShopId(Integer shopId);
    Optional<ShopProductsEntity> findByShopIdAndProductId(Integer shopId, Integer productId);
    boolean existsByShopIdAndProductId(Integer shopId, Integer productId);
}

package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ShopProductsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShopProductRepository extends JpaRepository<ShopProductsEntity, Integer> {
    List<ShopProductsEntity> findByShopId(Integer shopId);
    Page<ShopProductsEntity> findByShopId(Integer shopId, Pageable pageable);
    Optional<ShopProductsEntity> findByShopIdAndProductId(Integer shopId, Integer productId);
    boolean existsByShopIdAndProductId(Integer shopId, Integer productId);
}

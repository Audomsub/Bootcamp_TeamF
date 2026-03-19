package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ShopProductsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopProductRepository extends JpaRepository<ShopProductsEntity, Integer> {
    List<ShopProductsEntity> findByShopId(Integer shopId);

    /**
     * Fetch shop products with their associated Product eagerly via JOIN FETCH
     * to avoid LazyInitializationException when the session is closed.
     * A separate countQuery is required because JOIN FETCH is not allowed in count queries.
     */
    @Query(value = "SELECT sp FROM ShopProductsEntity sp JOIN FETCH sp.product WHERE sp.shopId = :shopId",
           countQuery = "SELECT COUNT(sp) FROM ShopProductsEntity sp WHERE sp.shopId = :shopId")
    Page<ShopProductsEntity> findByShopId(@Param("shopId") Integer shopId, Pageable pageable);

    Optional<ShopProductsEntity> findByShopIdAndProductId(Integer shopId, Integer productId);
    boolean existsByShopIdAndProductId(Integer shopId, Integer productId);
}


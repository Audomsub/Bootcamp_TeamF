package com.example.bootcamp.repository;

import com.example.bootcamp.entity.OrdersEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrdersEntity, Integer> {
    Optional<OrdersEntity> findByOrderNumber(String orderNumber);

    List<OrdersEntity> findByShopIdOrderByCreatedAtDesc(Integer shopId);

    Page<OrdersEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByShopId(Integer shopId);

    long countByShopIdAndStatus(Integer shopId, OrdersEntity.Status status);

    long countByShopIdAndIsReadByResellerFalse(Integer shopId);

    List<OrdersEntity> findByShopIdAndIsReadByResellerFalse(Integer shopId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE OrdersEntity o SET o.isReadByReseller = true WHERE o.shop.id = :shopId AND o.isReadByReseller = false")
    void markAllOrdersAsReadByShopId(Integer shopId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.resellerProfit) FROM OrdersEntity o WHERE o.shop.id = :shopId")
    java.math.BigDecimal sumProfitByShopId(Integer shopId);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM OrdersEntity o WHERE o.shop.id = :shopId ORDER BY o.createdAt DESC")
    Page<OrdersEntity> findRecentByShopId(Integer shopId, Pageable pageable);
}
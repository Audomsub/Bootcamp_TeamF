package com.example.bootcamp.repository;

import com.example.bootcamp.entity.OrdersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrdersEntity, Integer> {
    Optional<OrdersEntity> findByOrderNumber(String orderNumber);

    List<OrdersEntity> findByShopIdOrderByCreatedAtDesc(Integer shopId);
}
package com.example.bootcamp.repository;

import com.example.bootcamp.entity.OrderItemsEntity;
import com.example.bootcamp.entity.OrdersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemsEntity, Long> {
    List<OrderItemsEntity> findByOrderId(Long orderId);
    boolean existsByProductIdAndOrderStatusIn(Integer productId, List<OrdersEntity.Status> statuses);
}

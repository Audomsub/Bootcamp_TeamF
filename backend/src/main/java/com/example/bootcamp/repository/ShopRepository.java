package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ShopsEntity;
import com.example.bootcamp.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<ShopsEntity, Integer> {
    Optional<ShopsEntity> findByShopSlug(String shopSlug);
    Optional<ShopsEntity> findByUserId(Integer userId);
    boolean existsByShopName(String shopName);
    boolean existsByShopSlug(String shopSlug);

    /** Find all shops where the owner user has approved status */
    @Query("SELECT s FROM ShopsEntity s JOIN FETCH s.user u WHERE u.status = :status")
    List<ShopsEntity> findByUserStatus(@Param("status") UsersEntity.Status status);
}

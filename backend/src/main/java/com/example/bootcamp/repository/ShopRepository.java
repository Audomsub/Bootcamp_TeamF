package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ShopsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<ShopsEntity, Long> {
    Optional<ShopsEntity> findByShopSlug(String shopSlug); // ดึงข้อมูลร้านจาก URL
    Optional<ShopsEntity> findByUserId(Long userId);       // หาว่า User คนนี้มีร้านชื่ออะไร
    boolean existsByShopName(String shopName);      // เช็กชื่อร้านซ้ำ
    boolean existsByShopSlug(String shopSlug);      // เช็ก URL ซ้ำ
}

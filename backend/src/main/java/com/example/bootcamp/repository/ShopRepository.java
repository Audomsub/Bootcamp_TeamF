package com.example.bootcamp.repository;

import com.example.bootcamp.entity.ShopsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<ShopsEntity, Long> {
    Optional<ShopsEntity> findByShopSlug(String shopSlug);
    Optional<ShopsEntity> findByUserId(Long userId);
    boolean existsByShopName(String shopName);
    boolean existsByShopSlug(String shopSlug);
}

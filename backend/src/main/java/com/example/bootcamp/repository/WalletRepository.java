package com.example.bootcamp.repository;

import com.example.bootcamp.entity.WalletsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<WalletsEntity, Long> {
    Optional<WalletsEntity> findByUserId(Long userId); // ดึงกระเป๋าเงินของตัวแทนคนนั้นๆ
}

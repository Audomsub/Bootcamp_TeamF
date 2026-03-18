package com.example.bootcamp.repository;

import com.example.bootcamp.entity.WalletLogsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletLogRepository extends JpaRepository<WalletLogsEntity, Integer> {
    List<WalletLogsEntity> findByWalletIdOrderByCreatedAtDesc(Integer walletId); // ดึงประวัติเงินเข้า เรียงจากใหม่ไปเก่า
}

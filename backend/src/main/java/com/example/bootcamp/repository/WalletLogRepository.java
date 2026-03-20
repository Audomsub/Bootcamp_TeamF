package com.example.bootcamp.repository;

import com.example.bootcamp.entity.WalletLogsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletLogRepository extends JpaRepository<WalletLogsEntity, Integer> {
    // ดึงประวัติเงินเข้าของ Reseller โดย user_id (ตาม SQL schema: wallet_logs.user_id FK → users)
    List<WalletLogsEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);

    // แบบ paginated สำหรับ endpoint ที่ต้องการ pagination
    Page<WalletLogsEntity> findByUserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);
}

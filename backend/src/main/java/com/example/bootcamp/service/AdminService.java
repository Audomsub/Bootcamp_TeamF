package com.example.bootcamp.service;

import com.example.bootcamp.entity.UsersEntity;
import com.example.bootcamp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<UsersEntity> getAllReseller() {
        return userRepository.findAll();
    }

    @Transactional
    public String updateResellerStatus(Long userId , UsersEntity.Status status) {
        UsersEntity usersEntity = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("ไม่พบตัวแทน"));
        if (!"reseller".equalsIgnoreCase(usersEntity.getRole().name())) {
            throw new RuntimeException("ผู้ใช้งานคนนนี้ไม่ใช่ตัวแทน");
        }
        usersEntity.setStatus(status);
        userRepository.save(usersEntity);
        return "เปลี่ยนสถานะเป็น" + status + "เรียบร้อย";
    }
}

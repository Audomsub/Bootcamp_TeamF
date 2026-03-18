package com.example.bootcamp.repository;

import com.example.bootcamp.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UsersEntity, Integer> { // เปลี่ยน ID เป็น Integer ตาม Entity
    Optional<UsersEntity> findByEmail(String email);
    Optional<UsersEntity> findByName(String name); // ใช้ name แทน userName
    Optional<UsersEntity> findById(Integer userId);
    boolean existsByEmail(String email);
}
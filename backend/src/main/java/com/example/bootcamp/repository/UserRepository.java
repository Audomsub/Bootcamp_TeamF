package com.example.bootcamp.repository;

import com.example.bootcamp.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UsersEntity , Long> {

    Optional<UsersEntity> findByEmail(String email);
    boolean existsByEmail(String email);

}
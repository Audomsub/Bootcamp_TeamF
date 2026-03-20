package com.example.bootcamp.repository;

import com.example.bootcamp.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UsersEntity, Integer> {
    Optional<UsersEntity> findByEmail(String email);
    Optional<UsersEntity> findByName(String name);
    Optional<UsersEntity> findById(Integer userId);
    boolean existsByEmail(String email);

    /** Find all users with a given role — used to list resellers without including admins */
    List<UsersEntity> findByRole(UsersEntity.Role role);

    /** Find all users with a given role, ordered by status and creation date (pending first) */
    List<UsersEntity> findByRoleOrderByStatusAscCreatedAtDesc(UsersEntity.Role role);
}
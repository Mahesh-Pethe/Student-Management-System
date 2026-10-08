package com.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Active student
    Optional<Student> findByIdAndIsDeletedFalse(Long id);

    // Deleted student
    Optional<Student> findByIdAndIsDeletedTrue(Long id);

    // Only active students
    List<Student> findAllByIsDeletedFalse();

    // Only deleted students
    List<Student> findAllByIsDeletedTrue();
}
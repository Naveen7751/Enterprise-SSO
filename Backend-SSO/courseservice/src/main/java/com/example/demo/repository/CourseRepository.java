package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Course;
import com.example.demo.model.User;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByUser(User user);
    Optional<Course> findById(Long id);
}

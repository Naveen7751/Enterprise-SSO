package com.example.demo.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.DTO.CourseDTO;
import com.example.demo.model.Course;
import com.example.demo.model.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.UserRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<Course> getCourseDetailsByUser(User user) {
        return courseRepository.findByUser(user);
    }

    public Optional<Course> registerCourse(CourseDTO courseDTO, User user) {
        Course course = new Course();
        course.setUser(user);
        course.setCourseName(courseDTO.getCourseName());
        course.setDescription(courseDTO.getDescription());
        course = courseRepository.save(course);
        return Optional.of(course);
    }

    public List<String> getAllCourses() {
        return Arrays.asList("Mathematics", "Science", "History", "Art", "Physical Education", "Music", "Computer Science");
    }
}
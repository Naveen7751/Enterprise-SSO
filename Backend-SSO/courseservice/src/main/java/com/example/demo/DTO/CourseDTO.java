package com.example.demo.DTO;

import lombok.Data;

@Data
public class CourseDTO {
    private Long id;
    private String username;
    private String courseName;
    private String description;
    private String message;
}
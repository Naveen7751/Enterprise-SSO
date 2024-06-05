package com.example.demo.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.DTO.StudentDTO;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Optional<Student> getStudentDetailsByUser(User user) {
        return studentRepository.findByUser(user);
    }

    public Optional<Student> registerStudent(StudentDTO studentDTO, User user) {
        if (studentRepository.findByUser(user).isPresent()) {
            throw new IllegalArgumentException("Student already registered");
        }
        Student student = new Student();
        student.setUser(user);
        student.setName(studentDTO.getName());
        student.setUsername(studentDTO.getUsername());
        student = studentRepository.save(student);
        return Optional.of(student);
    }
}
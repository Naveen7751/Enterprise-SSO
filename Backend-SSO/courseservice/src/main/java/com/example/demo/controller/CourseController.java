package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.demo.DTO.CourseDTO;
import com.example.demo.DTO.JwtResponseDTO;
import com.example.demo.DTO.LoginDTO;
import com.example.demo.DTO.UserDTO;
import com.example.demo.model.Course;
import com.example.demo.model.User;
import com.example.demo.service.CourseService;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Value("${auth.service.url}")
    private String authServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private CourseService courseService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        try {
            ResponseEntity<JwtResponseDTO> response = restTemplate.postForEntity(authServiceUrl + "/auth/login", loginDTO, JwtResponseDTO.class);
            JwtResponseDTO responseBody = response.getBody();

            if (responseBody != null) {
                System.out.println("Token received: " + responseBody.getJwt());
                return ResponseEntity.ok(responseBody);
            } else {
                System.out.println("Response body is null");
                return ResponseEntity.status(500).body(null);
            }
        } catch (HttpClientErrorException.Forbidden e) {
            return ResponseEntity.status(403).body(null);  // Custom handling for 403
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/details")
    public ResponseEntity<CourseDTO> getCourseDetails(@RequestHeader("Authorization") String token, @RequestBody CourseDTO courseDTO) {
        String actualToken = token.replace("Bearer ", "");
        String username = jwtService.extractUsername(actualToken);
        if (!jwtService.isTokenValidForService(actualToken, "course")) {
            return ResponseEntity.status(403).build();
        }

        User user = userService.findByUsername(username);
        Optional<Course> courseOptional = courseService.getCourseDetailsByUser(user);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            CourseDTO responseDTO = new CourseDTO();
            responseDTO.setId(course.getId());
            responseDTO.setUsername(course.getUser().getUsername());
            responseDTO.setCourseName(course.getCourseName());
            responseDTO.setDescription(course.getDescription());
            return ResponseEntity.ok(responseDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<CourseDTO> registerCourse(@RequestHeader("Authorization") String token, @RequestBody CourseDTO courseDTO) {
        String actualToken = token.replace("Bearer ", "");
        String username = jwtService.extractUsername(actualToken);
        if (!jwtService.isTokenValidForService(actualToken, "course")) {
            return ResponseEntity.status(403).build();
        }

        User user = userService.findByUsername(username);
        Optional<Course> courseOptional = courseService.registerCourse(courseDTO, user);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            CourseDTO responseDTO = new CourseDTO();
            responseDTO.setId(course.getId());
            responseDTO.setCourseName(course.getCourseName());
            responseDTO.setDescription(course.getDescription());
            responseDTO.setMessage("Course registered successfully");
            return ResponseEntity.ok(responseDTO);
        } else {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> findUserById(@RequestHeader("Authorization") String token, @PathVariable("userId") Long userId) {
        Optional<User> userOptional = userService.findByUserId(userId);
        if (userOptional.isPresent()) {
            UserDTO userDTO = userService.convertToDTO(userOptional.get());
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        String actualToken = token.replace("Bearer ", "");
        jwtService.logoutToken(actualToken, "course");
        return ResponseEntity.ok("User logged out successfully");
    }

    @PostMapping("/sso-login")
    public ResponseEntity<JwtResponseDTO> ssoLogin(@RequestHeader("Authorization") String token) {
        String actualToken = token.replace("Bearer ", "");
        String username = jwtService.extractUsername(actualToken);
        if (jwtService.isTokenValidForService(actualToken, "course")) {
            return ResponseEntity.ok(new JwtResponseDTO(actualToken));
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @GetMapping("/all-courses")
    public ResponseEntity<List<String>> getAllCourses() {
        List<String> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
}

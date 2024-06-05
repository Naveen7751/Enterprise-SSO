package com.example.authservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.authservice.Service.JwtService;
import com.example.authservice.Service.UserService;
import com.example.authservice.dto.JwtResponseDTO;
import com.example.authservice.dto.LoginDTO;
import com.example.authservice.dto.UserDTO;
import com.example.authservice.model.User;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setRole("USER");
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));

        String jwt = jwtService.generateToken(loginDTO.getUsername());
        System.out.println("Generated Token: " + jwt);
        return ResponseEntity.ok(new JwtResponseDTO(jwt));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        String actualToken = token.replace("Bearer ", "");
        jwtService.logoutToken(actualToken, "employee");
        return ResponseEntity.ok("User logged out successfully");
    }
}

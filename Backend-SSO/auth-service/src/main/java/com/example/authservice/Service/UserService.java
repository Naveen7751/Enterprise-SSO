package com.example.authservice.Service;

import com.example.authservice.model.Token;
import com.example.authservice.model.User;
import com.example.authservice.repository.TokenRepository;
import com.example.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void saveUserToken(User user, String tokenString) {
        Optional<Token> existingTokenOpt = tokenRepository.findByUser(user);
        if (existingTokenOpt.isPresent()) {
            Token existingToken = existingTokenOpt.get();
            existingToken.setToken(tokenString);
            existingToken.setLoggedOutStudent(false);
            existingToken.setLoggedOutCourse(false);
            tokenRepository.save(existingToken);
        } else {
            Token newToken = new Token(tokenString);
            newToken.setUser(user);
            tokenRepository.save(newToken);
        }
    }
}

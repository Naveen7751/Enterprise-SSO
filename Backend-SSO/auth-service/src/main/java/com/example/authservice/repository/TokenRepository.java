package com.example.authservice.repository;

import com.example.authservice.model.Token;
import com.example.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);
    Optional<Token> findByUser(User user);  // Add this method
}

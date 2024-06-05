package com.example.authservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.authservice.model.Token;
import com.example.authservice.repository.TokenRepository;

@Service
public class TokenService {
    @Autowired
    private TokenRepository tokenRepository;

    public boolean checkToken(String token) {
        return tokenRepository.findByToken(token).isPresent();
    }

    public void blackListToken(String token) {
        Token t = new Token(token);
        tokenRepository.save(t);
    }
}

package com.example.authservice.dto;

import lombok.Data;

@Data
public class JwtResponseDTO {
    private String jwt;

    public JwtResponseDTO() {}

    public JwtResponseDTO(String jwt) {
        this.jwt = jwt;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}

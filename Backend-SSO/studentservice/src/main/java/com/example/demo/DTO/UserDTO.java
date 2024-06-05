package com.example.demo.DTO;

import lombok.Data;

@Data
public class UserDTO {
	private Long id;
	private String name;
    private String username;
    private String password;

    // getters and setters
}
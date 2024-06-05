package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

import com.example.demo.filter.JwtAuthFilter;
import com.example.demo.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	 @Autowired
	    private JwtAuthFilter jwtAuthFilter;

	    @Autowired
	    private CustomUserDetailsService userDetailsService;

	    @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

	    @Bean
	    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
	        return http.getSharedObject(AuthenticationManagerBuilder.class)
	                .userDetailsService(userDetailsService)
	                .passwordEncoder(passwordEncoder())
	                .and()
	                .build();
	    }

	    @Bean
	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	        http.csrf(AbstractHttpConfigurer::disable)
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/course/login","course/all-courses").permitAll()
	                .anyRequest().authenticated())
	            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
	            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

	        return http.build();
	    }
}

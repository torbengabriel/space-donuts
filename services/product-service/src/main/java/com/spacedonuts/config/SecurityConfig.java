package com.spacedonuts.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    return http
      .cors(Customizer.withDefaults())
      .csrf(AbstractHttpConfigurer::disable)
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
        .requestMatchers("/api/cart", "/api/cart/**").authenticated()
        .requestMatchers("/api/admin", "/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated()
      )
      .oauth2ResourceServer(oauth2 -> oauth2
        .jwt(Customizer.withDefaults())
      )
      .build();
  }
}

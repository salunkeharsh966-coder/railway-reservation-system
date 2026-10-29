package com.example.railway.dto;

import com.example.railway.entity.Role;
import com.example.railway.entity.User;
import lombok.*;

/** Response returned after a successful login. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String message;
    private Long userId;
    private String name;
    private String email;
    private Role role;

    public static AuthResponse from(User user) {
        return AuthResponse.builder()
                .message("Login successful")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}

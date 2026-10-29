package com.example.railway.dto;

import com.example.railway.entity.Role;
import lombok.*;

/** Safe user view returned to the client (never exposes the password). */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
}

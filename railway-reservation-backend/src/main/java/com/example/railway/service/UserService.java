package com.example.railway.service;

import com.example.railway.dto.*;
import com.example.railway.entity.Role;
import com.example.railway.entity.User;
import com.example.railway.exception.BadRequestException;
import com.example.railway.exception.ResourceNotFoundException;
import com.example.railway.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * User registration, login and profile management.
 *
 * NOTE: passwords are stored as plain text for this academic demo. A production
 * build must hash them (e.g. BCrypt) and issue a signed token instead of
 * returning the user id to the client.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }
        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(request.getPassword())
                .phone(request.getPhone())
                .role(Role.USER)
                .build();
        User saved = userRepository.save(user);
        return AuthResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }
        return AuthResponse.from(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(Long id, RegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        String email = request.getEmail().trim().toLowerCase();
        if (!email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(request.getPassword());
        }
        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserService::toResponse).toList();
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        userRepository.delete(user);
    }

    private static UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .build();
    }
}

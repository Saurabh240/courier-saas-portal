package com.courier.app.usermgmt.controller;

import com.courier.app.config.JwtUtil;
import com.courier.app.usermgmt.dto.LoginRequest;
import com.courier.app.usermgmt.dto.LoginResponse;
import com.courier.app.usermgmt.dto.RegisterRequest;
import com.courier.app.usermgmt.dto.UserResponse;
import com.courier.app.usermgmt.model.User;
import com.courier.app.usermgmt.repository.UserRepository;
import com.courier.app.usermgmt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;
    private final UserService service;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserController(UserRepository repo, UserService service) {
        this.repo = repo;
        this.service = service;
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest req) {
        return service.register(req);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        User user = repo.findByEmail(req.email).orElseThrow();
        if (encoder.matches(req.password, user.getPassword())) {
            return new LoginResponse(JwtUtil.generateToken(user.getEmail(), user.getRole().name()),user.getRole());
        }
        throw new RuntimeException("Invalid credentials");
    }

    @GetMapping
    public List<UserResponse> listAll() {
        return service.listUsers();
    }
}

package com.courier.app.usermgmt.service;

import com.courier.app.usermgmt.dto.RegisterRequest;
import com.courier.app.usermgmt.dto.UserResponse;
import com.courier.app.usermgmt.model.User;
import com.courier.app.usermgmt.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public UserResponse register(RegisterRequest req) {
        String hashed = encoder.encode(req.password);
        User user = new User(req.name, req.email, hashed, req.role);
        User saved = repo.save(user);
        return new UserResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    public List<UserResponse> listUsers() {
        return repo.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole()))
                .collect(Collectors.toList());
    }
}

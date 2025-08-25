package com.courier.app.usermgmt.service;

import com.courier.app.usermgmt.dto.RegisterRequest;
import com.courier.app.usermgmt.dto.UserResponse;
import com.courier.app.usermgmt.model.Role;
import com.courier.app.usermgmt.model.User;
import com.courier.app.usermgmt.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        String hashed = encoder.encode(req.getPassword());
        User user = new User(req.getName(), req.getEmail(), hashed, req.getPhoneNo(), req.getRole(),req.getVerified());
        User saved = null;
        try {
            saved = repo.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("users_email_key", ex);
        }

        return new UserResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getPhoneNo(), saved.getRole(),saved.getVerified());
    }

    public List<UserResponse> listUsers(String role, Boolean verified) {
        return repo.findAll().stream()
                .filter(u -> role == null || u.getRole() == Role.valueOf(role.toUpperCase()))
                .filter(u -> verified == null || u.getVerified() == verified)
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getPhoneNo(),
                        u.getRole(),
                        u.getVerified()
                ))
                .collect(Collectors.toList());
    }

}

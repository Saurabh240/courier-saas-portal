package com.courier.app.usermgmt.service;

import com.courier.app.notification.service.EmailService;
import com.courier.app.usermgmt.dto.RegisterRequest;
import com.courier.app.usermgmt.dto.UserResponse;
import com.courier.app.usermgmt.model.PasswordResetToken;
import com.courier.app.usermgmt.model.Role;
import com.courier.app.usermgmt.model.User;
import com.courier.app.usermgmt.repository.PasswordResetTokenRepository;
import com.courier.app.usermgmt.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[A-Z])(?=.*\\d).{8,}$");
    private final UserRepository repo;
    private final PasswordResetTokenRepository tokenRepo;
    private final EmailService emailService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public UserService(UserRepository repo,PasswordResetTokenRepository tokenRepo,
                       EmailService emailService) {
        this.repo = repo;
        this.tokenRepo = tokenRepo;
        this.emailService = emailService;
    }

    public UserResponse register(RegisterRequest req) {
        String hashed = encoder.encode(req.getPassword());
        User user = new User(req.getName(), req.getEmail(), hashed, req.getPhoneNo(), req.getRole(),req.isVerified());
        User saved = null;
        try {
            saved = repo.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("users_email_key", ex);
        }

        return new UserResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getPhoneNo(), saved.getRole(),saved.isVerified());
    }

    public List<UserResponse> listUsers(String role, Boolean verified) {
        return repo.findAll().stream()
                .filter(u -> role == null || u.getRole() == Role.valueOf(role.toUpperCase()))
                .filter(u -> verified == null || u.isVerified() == verified)
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getPhoneNo(),
                        u.getRole(),
                        u.isVerified()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void forgotPassword(String email) {
        Optional<User> userOpt = repo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();

        // Invalidate any previously issued, still-active tokens for this user
        tokenRepo.invalidateActiveTokensForUser(user.getId());

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(
                token, user.getId(), LocalDateTime.now().plusHours(1));
        tokenRepo.save(resetToken);

        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String body = "Hi " + user.getName() + ",\n\n"
                + "We received a request to reset your password. Click the link below to set a new password:\n\n"
                + resetLink + "\n\n"
                + "This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.";

        emailService.sendEmail(user.getEmail(), "Reset your password", body);
    }

    /**
     * Validates the reset token and updates the user's password.
     * Token is atomically marked used to prevent replay/double-submit races.
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (newPassword == null || !PASSWORD_PATTERN.matcher(newPassword).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must be at least 8 characters and include 1 uppercase letter and 1 number");
        }

        PasswordResetToken resetToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token"));

        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token");
        }

        // Atomically claim the token — prevents two concurrent requests from both succeeding
        int claimed = tokenRepo.markTokenUsed(token, LocalDateTime.now());
        if (claimed == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token");
        }

        User user = repo.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token"));

        user.setPassword(encoder.encode(newPassword));
        repo.save(user);
    }
}

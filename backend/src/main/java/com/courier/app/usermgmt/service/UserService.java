package com.courier.app.usermgmt.service;

import com.courier.app.notification.service.EmailService;
import com.courier.app.usermgmt.dto.AdminCreateUserRequest;
import com.courier.app.usermgmt.dto.RegisterRequest;
import com.courier.app.usermgmt.dto.UserResponse;
import com.courier.app.usermgmt.model.PasswordResetToken;
import com.courier.app.usermgmt.model.Role;
import com.courier.app.usermgmt.model.User;
import com.courier.app.usermgmt.repository.PasswordResetTokenRepository;
import com.courier.app.usermgmt.repository.UserRepository;
import org.springframework.data.domain.Page;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
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
    private static final String TEMP_PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    private final SecureRandom secureRandom = new SecureRandom();

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


    /**
     * Admin-only creation of STAFF or DELIVERY_PARTNER accounts.
     * Generates a temporary password and emails it to the new user.
     */
    @Transactional
    public UserResponse createUserByAdmin(AdminCreateUserRequest req) {
        if (req.getRole() != Role.STAFF && req.getRole() != Role.DELIVERY_PARTNER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Role must be either STAFF or DELIVERY_PARTNER");
        }

        if (repo.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        String tempPassword = generateTempPassword();
        String hashed = encoder.encode(tempPassword);

        User user = new User(req.getName(), req.getEmail(), hashed, req.getPhoneNo(), req.getRole(), true);
        User saved;
        try {
            saved = repo.save(user);
        } catch (DataIntegrityViolationException ex) {
            // Race condition fallback: two concurrent requests with the same email
            // both pass existsByEmail() before either commits.
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        String subject = "Welcome to Courier SaaS Portal — Your Account Details";
        String body = "Hi " + saved.getName() + ",\n\n"
                + "An account has been created for you as a " + saved.getRole() + ".\n\n"
                + "Login email: " + saved.getEmail() + "\n"
                + "Temporary password: " + tempPassword + "\n\n"
                + "Please log in and change your password as soon as possible.";

        emailService.sendEmail(saved.getEmail(), subject, body);

        return new UserResponse(saved.getId(), saved.getName(), saved.getEmail(),
                saved.getPhoneNo(), saved.getRole(), saved.isVerified());
    }

    /**
     * Paginated user listing, optionally filtered by role.
     */
    public Page<UserResponse> listUsersPaged(Role role, Pageable pageable) {
        Page<User> page = (role != null)
                ? repo.findByRole(role, pageable)
                : repo.findAll(pageable);

        return page.map(u -> new UserResponse(
                u.getId(), u.getName(), u.getEmail(), u.getPhoneNo(), u.getRole(), u.isVerified()));
    }

    /**
     * Soft-delete: marks the user as unverified/inactive rather than removing the row.
     */
    @Transactional
    public void softDeleteUser(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setVerified(false);
        repo.save(user);
    }

    private String generateTempPassword() {
        // Guarantees at least one uppercase + one digit, satisfying the same
        // complexity rule used in resetPassword, then fills the rest randomly.
        StringBuilder sb = new StringBuilder(12);
        sb.append("ABCDEFGHJKLMNPQRSTUVWXYZ".charAt(secureRandom.nextInt(24)));
        sb.append("23456789".charAt(secureRandom.nextInt(8)));
        for (int i = 0; i < 10; i++) {
            sb.append(TEMP_PASSWORD_CHARS.charAt(secureRandom.nextInt(TEMP_PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}

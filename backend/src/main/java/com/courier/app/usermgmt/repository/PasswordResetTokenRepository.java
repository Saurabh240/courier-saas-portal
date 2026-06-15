package com.courier.app.usermgmt.repository;

import com.courier.app.usermgmt.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.used = true WHERE t.userId = :userId AND t.used = false")
    void invalidateActiveTokensForUser(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.used = true " +
            "WHERE t.token = :token AND t.used = false AND t.expiryDate > :now")
    int markTokenUsed(@Param("token") String token, @Param("now") LocalDateTime now);
}
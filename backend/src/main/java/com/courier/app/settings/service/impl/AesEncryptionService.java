package com.courier.app.settings.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256-GCM encryption/decryption for sensitive tenant credentials
 * (SMTP passwords, Twilio auth tokens).
 *
 * <p>The encryption key is read from {@code app.encryption.secret} in
 * {@code application.properties}. It must be exactly 32 characters (256 bits).
 * In production this value should be injected via an environment variable or
 * a secrets manager, never committed to source control.</p>
 *
 * <p>Ciphertext format (base64-encoded): {@code [12-byte IV][16-byte GCM tag + ciphertext]}.</p>
 */
@Slf4j
@Service
public class AesEncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH_BYTES = 12;
    private static final int GCM_TAG_LENGTH_BITS = 128;
    private static final String MASKED = "••••••••";

    private final SecretKey secretKey;

    public AesEncryptionService(@Value("${app.encryption.secret}") String secret) {
        byte[] keyBytes = secret.getBytes();
        if (keyBytes.length != 32) {
            throw new IllegalArgumentException(
                    "app.encryption.secret must be exactly 32 characters (256 bits), got " + keyBytes.length);
        }
        this.secretKey = new SecretKeySpec(keyBytes, "AES");
    }

    /**
     * Encrypts {@code plaintext} and returns a base64-encoded ciphertext string
     * suitable for storage in the DB. Returns {@code null} if input is null/blank.
     */
    public String encrypt(String plaintext) {
        if (plaintext == null || plaintext.isBlank()) return null;
        try {
            byte[] iv = new byte[IV_LENGTH_BYTES];
            new SecureRandom().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));
            byte[] ciphertext = cipher.doFinal(plaintext.getBytes());

            // Prepend IV so we have it available for decryption
            ByteBuffer buffer = ByteBuffer.allocate(iv.length + ciphertext.length);
            buffer.put(iv);
            buffer.put(ciphertext);
            return Base64.getEncoder().encodeToString(buffer.array());
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    /**
     * Decrypts a base64-encoded ciphertext previously produced by {@link #encrypt}.
     * Returns {@code null} if input is null/blank.
     */
    public String decrypt(String ciphertextBase64) {
        if (ciphertextBase64 == null || ciphertextBase64.isBlank()) return null;
        try {
            byte[] decoded = Base64.getDecoder().decode(ciphertextBase64);
            ByteBuffer buffer = ByteBuffer.wrap(decoded);

            byte[] iv = new byte[IV_LENGTH_BYTES];
            buffer.get(iv);
            byte[] ciphertext = new byte[buffer.remaining()];
            buffer.get(ciphertext);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));
            return new String(cipher.doFinal(ciphertext));
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }

    /** Constant used to mask secrets in GET responses. */
    public static String masked() {
        return MASKED;
    }
}
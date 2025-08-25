package com.courier.app.usermgmt.dto;


import com.courier.app.usermgmt.model.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;
    @Email
    @NotBlank
    private String email;
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @Pattern(
            regexp = "^\\+(?:[0-9] ?){6,14}[0-9]$",
            message = "Phone number must be 10 digits starting with 6-9 with international code"
    )
    private String phoneNo;
    @NotNull
    private Role role;
    private Boolean verified;

}

package com.courier.app.usermgmt.dto;

import com.courier.app.usermgmt.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AdminCreateUserRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^\\+[1-9]\\d{1,3}[ -]?\\d{6,12}$",
            message = "Phone number must include a valid country code and 6-12 digit number"
    )
    private String phoneNo;

    @NotNull(message = "Role is required")
    private Role role;
}
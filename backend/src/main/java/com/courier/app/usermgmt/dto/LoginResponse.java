package com.courier.app.usermgmt.dto;

import com.courier.app.usermgmt.model.Role;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Role role;

    public LoginResponse(String token, Role role) {
        this.token = token;
        this.role = role;
    }
}

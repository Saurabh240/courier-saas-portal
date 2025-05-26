package com.courier.app.usermgmt.dto;

import com.courier.app.usermgmt.model.Role;
import lombok.Data;

@Data
public class UserResponse {
    public Long id;
    public String name;
    public String email;
    public Role role;

    public UserResponse(Long id, String name, String email, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}

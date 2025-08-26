package com.courier.app.usermgmt.dto;

import com.courier.app.usermgmt.model.Role;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private boolean verified;

    public UserResponse(Long id, String name, String email,String phone, Role role,boolean verified) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.verified = verified;
    }
}

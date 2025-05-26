package com.courier.app.usermgmt.dto;


import com.courier.app.usermgmt.model.Role;

public class RegisterRequest {
    public String name;
    public String email;
    public String password;
    public Role role;
}

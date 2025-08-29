package com.courier.app.usermgmt.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    @Column(name = "phone_no")
    private String phoneNo;
    @Enumerated(EnumType.STRING)
    private Role role;
    private boolean verified;

    public User() {
    }

    public User(String name, String email, String password, String phoneNo, Role role,boolean verified) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNo = phoneNo;
        this.role = role;
        this.verified = verified;
    }
}

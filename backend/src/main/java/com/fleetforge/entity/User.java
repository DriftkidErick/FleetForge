package com.fleetforge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "app_user")
public class User extends BaseEntity{

    @NotBlank(message = "Name is required!")
    private String name;

    @NotBlank(message = "Email is required!")
    @Email(message = "Email must be valid!")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required!")
    @Column(nullable = false)
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

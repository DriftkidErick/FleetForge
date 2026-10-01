package com.fleetforge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Driver extends BaseEntity{

    @NotBlank(message = "First name is required!")
    private String fName;

    @NotBlank(message = "Last name is required!")
    private String lName;

    @NotBlank(message = "Email is required!")
    @Email(message = "Email must be valid!")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Phone number is required!")
    private String phoneNum;

    @NotBlank(message = "Status is required!")
    private String status;

    public String getFullName(){
        return fName + " " + lName;
    }

    //Getter and Setters
    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

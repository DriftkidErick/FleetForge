package com.fleetforge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import  jakarta.validation.constraints.NotBlank;

@Entity
public class MaintenanceType extends BaseEntity{

    @NotBlank(message = "Maintenance type is required!")
    @Column(unique = true, nullable = false)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}

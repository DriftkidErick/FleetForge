package com.fleetforge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Vehicle extends BaseEntity {

    //Created to ensure the Vin and Reg are both Unique and cannot be null
    @Column(unique = true, nullable = false)
    private String vin;

    @Column(unique = true, nullable = false)
    private String regNum;

    private int year;
    private int mileage;
    private String make;
    private String model;
    private String status;

    //Getter and Setters
    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getRegNum() {
        return regNum;
    }

    public void setRegNum(String regNum) {
        this.regNum = regNum;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMileage() {
        return mileage;
    }

    public void setMileage(int mileage) {
        this.mileage = mileage;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}

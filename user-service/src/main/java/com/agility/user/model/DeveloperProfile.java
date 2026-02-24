package com.agility.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "developer_profiles")
public class DeveloperProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String skills;

    @Column(columnDefinition = "DOUBLE DEFAULT 40")
    private Double weeklyCapacityHours = 40.0;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean available = true;

    public DeveloperProfile() {
    }

    public DeveloperProfile(Long userId, String skills, Double weeklyCapacityHours, Boolean available) {
        this.userId = userId;
        this.skills = skills;
        this.weeklyCapacityHours = weeklyCapacityHours;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public Double getWeeklyCapacityHours() {
        return weeklyCapacityHours;
    }

    public void setWeeklyCapacityHours(Double weeklyCapacityHours) {
        this.weeklyCapacityHours = weeklyCapacityHours;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}

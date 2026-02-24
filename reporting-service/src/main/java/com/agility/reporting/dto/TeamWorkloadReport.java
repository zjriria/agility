package com.agility.reporting.dto;

public class TeamWorkloadReport {

    private Long userId;
    private String username;
    private Double totalHoursLogged;
    private Double capacity;
    private Double loadRatePercentage;

    public TeamWorkloadReport() {
    }

    public TeamWorkloadReport(Long userId, String username, Double totalHoursLogged,
                              Double capacity, Double loadRatePercentage) {
        this.userId = userId;
        this.username = username;
        this.totalHoursLogged = totalHoursLogged;
        this.capacity = capacity;
        this.loadRatePercentage = loadRatePercentage;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Double getTotalHoursLogged() {
        return totalHoursLogged;
    }

    public void setTotalHoursLogged(Double totalHoursLogged) {
        this.totalHoursLogged = totalHoursLogged;
    }

    public Double getCapacity() {
        return capacity;
    }

    public void setCapacity(Double capacity) {
        this.capacity = capacity;
    }

    public Double getLoadRatePercentage() {
        return loadRatePercentage;
    }

    public void setLoadRatePercentage(Double loadRatePercentage) {
        this.loadRatePercentage = loadRatePercentage;
    }
}

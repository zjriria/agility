package com.agility.timetracking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CapacityReport {

    private Long userId;
    private String username;
    private Double totalAvailableHours;
    private Double totalLoggedHours;
    private Double loadRatePercentage;
    private String alertLevel;

    public boolean isUnderloaded() {
        return loadRatePercentage != null && loadRatePercentage < 80.0;
    }

    public boolean isOverloaded() {
        return loadRatePercentage != null && loadRatePercentage > 100.0;
    }
}

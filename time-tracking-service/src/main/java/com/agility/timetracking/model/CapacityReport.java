package com.agility.timetracking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CapacityReport {

    public static final double UNDERLOAD_THRESHOLD = 80.0;
    public static final double OVERLOAD_THRESHOLD = 100.0;

    private Long userId;
    private String username;
    private Double totalAvailableHours;
    private Double totalLoggedHours;
    private Double loadRatePercentage;
    private String alertLevel;

    public boolean isUnderloaded() {
        return loadRatePercentage != null && loadRatePercentage < UNDERLOAD_THRESHOLD;
    }

    public boolean isOverloaded() {
        return loadRatePercentage != null && loadRatePercentage > OVERLOAD_THRESHOLD;
    }
}

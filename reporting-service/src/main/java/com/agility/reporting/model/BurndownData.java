package com.agility.reporting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BurndownData {

    private Long sprintId;
    private LocalDate sprintStartDate;
    private LocalDate sprintEndDate;
    private double totalStoryPoints;
    private List<BurndownPoint> idealBurndown;
    private List<BurndownPoint> actualBurndown;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BurndownPoint {
        private LocalDate date;
        private double remainingPoints;
    }
}

package com.agility.reporting.dto;

import java.time.LocalDate;

public class BurndownPoint {

    private LocalDate date;
    private Double remainingWork;
    private Double idealRemaining;

    public BurndownPoint() {
    }

    public BurndownPoint(LocalDate date, Double remainingWork, Double idealRemaining) {
        this.date = date;
        this.remainingWork = remainingWork;
        this.idealRemaining = idealRemaining;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getRemainingWork() {
        return remainingWork;
    }

    public void setRemainingWork(Double remainingWork) {
        this.remainingWork = remainingWork;
    }

    public Double getIdealRemaining() {
        return idealRemaining;
    }

    public void setIdealRemaining(Double idealRemaining) {
        this.idealRemaining = idealRemaining;
    }
}

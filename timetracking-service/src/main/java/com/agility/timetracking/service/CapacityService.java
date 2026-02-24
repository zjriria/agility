package com.agility.timetracking.service;

import com.agility.timetracking.model.AlertType;
import com.agility.timetracking.model.CapacityAlert;
import com.agility.timetracking.model.TimeEntry;
import com.agility.timetracking.repository.CapacityAlertRepository;
import com.agility.timetracking.repository.TimeEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CapacityService {

    private final TimeEntryRepository timeEntryRepository;
    private final CapacityAlertRepository capacityAlertRepository;

    public CapacityService(TimeEntryRepository timeEntryRepository, CapacityAlertRepository capacityAlertRepository) {
        this.timeEntryRepository = timeEntryRepository;
        this.capacityAlertRepository = capacityAlertRepository;
    }

    public Double calculateIndividualCapacity(Long userId, LocalDate startDate, LocalDate endDate) {
        List<TimeEntry> entries = timeEntryRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        return entries.stream()
                .mapToDouble(TimeEntry::getHoursSpent)
                .sum();
    }

    public Double calculateLoadRate(Long userId, Double weeklyCapacityHours, LocalDate startDate, LocalDate endDate) {
        double hoursLogged = calculateIndividualCapacity(userId, startDate, endDate);
        // Calendar-based calculation: partial weeks are prorated proportionally
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        double weeks = days / 7.0;
        double totalCapacity = weeklyCapacityHours * weeks;
        if (totalCapacity == 0) {
            return 0.0;
        }
        return (hoursLogged / totalCapacity) * 100.0;
    }

    public CapacityAlert checkLoadAlerts(Long userId, Long sprintId, Double weeklyCapacityHours,
                                         LocalDate startDate, LocalDate endDate) {
        double loadRate = calculateLoadRate(userId, weeklyCapacityHours, startDate, endDate);

        if (loadRate >= 100.0) {
            CapacityAlert alert = new CapacityAlert();
            alert.setUserId(userId);
            alert.setSprintId(sprintId);
            alert.setAlertType(AlertType.OVERLOAD);
            alert.setLoadRate(loadRate);
            alert.setMessage(String.format("User is overloaded at %.1f%% capacity", loadRate));
            alert.setCreatedAt(LocalDateTime.now());
            return capacityAlertRepository.save(alert);
        } else if (loadRate < 80.0) {
            CapacityAlert alert = new CapacityAlert();
            alert.setUserId(userId);
            alert.setSprintId(sprintId);
            alert.setAlertType(AlertType.UNDERLOAD);
            alert.setLoadRate(loadRate);
            alert.setMessage(String.format("User is underloaded at %.1f%% capacity", loadRate));
            alert.setCreatedAt(LocalDateTime.now());
            return capacityAlertRepository.save(alert);
        }

        return null;
    }

    public List<CapacityAlert> getAlertsByUserId(Long userId) {
        return capacityAlertRepository.findByUserId(userId);
    }

    public List<CapacityAlert> getAlertsBySprintId(Long sprintId) {
        return capacityAlertRepository.findBySprintId(sprintId);
    }
}

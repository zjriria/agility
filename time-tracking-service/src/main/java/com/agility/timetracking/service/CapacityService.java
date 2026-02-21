package com.agility.timetracking.service;

import com.agility.timetracking.model.CapacityReport;
import com.agility.timetracking.model.TimeEntry;
import com.agility.timetracking.repository.TimeEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CapacityService {

    private final TimeEntryRepository timeEntryRepository;

    private static final double DEFAULT_WEEKLY_CAPACITY = 40.0;
    private static final double UNDERLOAD_THRESHOLD = CapacityReport.UNDERLOAD_THRESHOLD;
    private static final double OVERLOAD_THRESHOLD = CapacityReport.OVERLOAD_THRESHOLD;

    public CapacityReport getUserCapacity(Long userId, LocalDate startDate, LocalDate endDate,
                                           Double weeklyCapacityHours) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<TimeEntry> entries = timeEntryRepository.findByUserIdAndDateBetween(userId, start, end);
        double totalLogged = entries.stream().mapToDouble(TimeEntry::getHoursLogged).sum();

        long days = start.until(end).getDays() + 1;
        double weeksInPeriod = days / 7.0;
        double capacity = weeklyCapacityHours != null ? weeklyCapacityHours : DEFAULT_WEEKLY_CAPACITY;
        double totalAvailable = capacity * weeksInPeriod;

        double loadRate = totalAvailable > 0 ? (totalLogged / totalAvailable) * 100.0 : 0.0;

        CapacityReport report = new CapacityReport();
        report.setUserId(userId);
        report.setTotalAvailableHours(totalAvailable);
        report.setTotalLoggedHours(totalLogged);
        report.setLoadRatePercentage(loadRate);
        report.setAlertLevel(determineAlertLevel(loadRate));
        return report;
    }

    public List<CapacityReport> getTeamCapacity(List<Long> userIds, LocalDate startDate, LocalDate endDate) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<TimeEntry> entries = timeEntryRepository.findByUserIdInAndDateBetween(userIds, start, end);
        Map<Long, Double> loggedByUser = entries.stream()
                .collect(Collectors.groupingBy(TimeEntry::getUserId,
                        Collectors.summingDouble(TimeEntry::getHoursLogged)));

        long days = start.until(end).getDays() + 1;
        double weeksInPeriod = days / 7.0;
        double totalAvailable = DEFAULT_WEEKLY_CAPACITY * weeksInPeriod;

        List<CapacityReport> reports = new ArrayList<>();
        for (Long userId : userIds) {
            double logged = loggedByUser.getOrDefault(userId, 0.0);
            double loadRate = totalAvailable > 0 ? (logged / totalAvailable) * 100.0 : 0.0;

            CapacityReport report = new CapacityReport();
            report.setUserId(userId);
            report.setTotalAvailableHours(totalAvailable);
            report.setTotalLoggedHours(logged);
            report.setLoadRatePercentage(loadRate);
            report.setAlertLevel(determineAlertLevel(loadRate));
            reports.add(report);
        }
        return reports;
    }

    public List<CapacityReport> getAlerts(LocalDate startDate, LocalDate endDate) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<TimeEntry> entries = timeEntryRepository.findByDateBetween(start, end);
        Map<Long, Double> loggedByUser = entries.stream()
                .collect(Collectors.groupingBy(TimeEntry::getUserId,
                        Collectors.summingDouble(TimeEntry::getHoursLogged)));

        long days = start.until(end).getDays() + 1;
        double weeksInPeriod = days / 7.0;
        double totalAvailable = DEFAULT_WEEKLY_CAPACITY * weeksInPeriod;

        return loggedByUser.entrySet().stream()
                .map(entry -> {
                    double loadRate = totalAvailable > 0 ? (entry.getValue() / totalAvailable) * 100.0 : 0.0;
                    CapacityReport report = new CapacityReport();
                    report.setUserId(entry.getKey());
                    report.setTotalAvailableHours(totalAvailable);
                    report.setTotalLoggedHours(entry.getValue());
                    report.setLoadRatePercentage(loadRate);
                    report.setAlertLevel(determineAlertLevel(loadRate));
                    return report;
                })
                .filter(r -> r.isUnderloaded() || r.isOverloaded())
                .collect(Collectors.toList());
    }

    private String determineAlertLevel(double loadRate) {
        if (loadRate > OVERLOAD_THRESHOLD) return "OVERLOAD";
        if (loadRate < UNDERLOAD_THRESHOLD) return "UNDERLOAD";
        return "NORMAL";
    }
}

package com.agility.timetracking.service;

import com.agility.timetracking.model.TimeEntry;
import com.agility.timetracking.repository.TimeEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TimeEntryService {

    private final TimeEntryRepository timeEntryRepository;

    public TimeEntryService(TimeEntryRepository timeEntryRepository) {
        this.timeEntryRepository = timeEntryRepository;
    }

    public List<TimeEntry> findAll() {
        return timeEntryRepository.findAll();
    }

    public Optional<TimeEntry> findById(String id) {
        return timeEntryRepository.findById(id);
    }

    public List<TimeEntry> findByUserId(Long userId) {
        return timeEntryRepository.findByUserId(userId);
    }

    public List<TimeEntry> findByTaskId(Long taskId) {
        return timeEntryRepository.findByTaskId(taskId);
    }

    public List<TimeEntry> findByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return timeEntryRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    public TimeEntry create(TimeEntry timeEntry) {
        timeEntry.setCreatedAt(LocalDateTime.now());
        return timeEntryRepository.save(timeEntry);
    }

    public TimeEntry update(String id, TimeEntry timeEntry) {
        if (!timeEntryRepository.existsById(id)) {
            throw new RuntimeException("Time entry not found with id: " + id);
        }
        timeEntry.setId(id);
        return timeEntryRepository.save(timeEntry);
    }

    public void delete(String id) {
        timeEntryRepository.deleteById(id);
    }
}

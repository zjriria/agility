package com.agility.timetracking.service;

import com.agility.timetracking.model.TimeEntry;
import com.agility.timetracking.repository.TimeEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeTrackingService {

    private final TimeEntryRepository timeEntryRepository;

    public TimeEntry logTime(TimeEntry entry) {
        entry.setCreatedAt(LocalDateTime.now());
        return timeEntryRepository.save(entry);
    }

    public List<TimeEntry> getEntries(Long userId, String taskId, LocalDate startDate, LocalDate endDate) {
        if (userId != null && startDate != null && endDate != null) {
            return timeEntryRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        }
        if (userId != null) {
            return timeEntryRepository.findByUserId(userId);
        }
        if (taskId != null) {
            return timeEntryRepository.findByTaskId(taskId);
        }
        if (startDate != null && endDate != null) {
            return timeEntryRepository.findByDateBetween(startDate, endDate);
        }
        return timeEntryRepository.findAll();
    }

    public TimeEntry getEntryById(Long id) {
        return timeEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Time entry not found with id: " + id));
    }

    public TimeEntry updateEntry(Long id, TimeEntry updatedEntry) {
        TimeEntry entry = getEntryById(id);
        entry.setDate(updatedEntry.getDate());
        entry.setHoursLogged(updatedEntry.getHoursLogged());
        entry.setTaskType(updatedEntry.getTaskType());
        entry.setDescription(updatedEntry.getDescription());
        return timeEntryRepository.save(entry);
    }

    public void deleteEntry(Long id) {
        timeEntryRepository.deleteById(id);
    }
}

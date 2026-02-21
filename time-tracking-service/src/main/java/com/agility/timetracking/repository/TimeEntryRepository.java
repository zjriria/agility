package com.agility.timetracking.repository;

import com.agility.timetracking.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByUserId(Long userId);
    List<TimeEntry> findByTaskId(String taskId);
    List<TimeEntry> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    List<TimeEntry> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<TimeEntry> findByUserIdIn(List<Long> userIds);
    List<TimeEntry> findByUserIdInAndDateBetween(List<Long> userIds, LocalDate startDate, LocalDate endDate);
}

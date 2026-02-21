package com.agility.timetracking.repository;

import com.agility.timetracking.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    List<TimeEntry> findByUserId(Long userId);

    List<TimeEntry> findByTaskId(Long taskId);

    List<TimeEntry> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}

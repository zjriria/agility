package com.agility.timetracking.repository;

import com.agility.timetracking.model.TimeEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends MongoRepository<TimeEntry, String> {

    List<TimeEntry> findByUserId(Long userId);

    List<TimeEntry> findByTaskId(Long taskId);

    List<TimeEntry> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}

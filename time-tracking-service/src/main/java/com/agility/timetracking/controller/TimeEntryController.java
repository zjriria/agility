package com.agility.timetracking.controller;

import com.agility.timetracking.model.TimeEntry;
import com.agility.timetracking.service.TimeTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/time-entries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimeEntryController {

    private final TimeTrackingService timeTrackingService;

    @PostMapping
    public ResponseEntity<TimeEntry> logTime(@RequestBody TimeEntry entry) {
        return ResponseEntity.ok(timeTrackingService.logTime(entry));
    }

    @GetMapping
    public ResponseEntity<List<TimeEntry>> getEntries(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String taskId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(timeTrackingService.getEntries(userId, taskId, startDate, endDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeEntry> getEntryById(@PathVariable Long id) {
        return ResponseEntity.ok(timeTrackingService.getEntryById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeEntry> updateEntry(@PathVariable Long id, @RequestBody TimeEntry entry) {
        return ResponseEntity.ok(timeTrackingService.updateEntry(id, entry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        timeTrackingService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}

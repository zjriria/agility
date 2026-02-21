package com.agility.timetracking.service;

import com.agility.timetracking.model.AlertType;
import com.agility.timetracking.model.CapacityAlert;
import com.agility.timetracking.model.TimeEntry;
import com.agility.timetracking.repository.CapacityAlertRepository;
import com.agility.timetracking.repository.TimeEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CapacityServiceTest {

    @Mock
    private TimeEntryRepository timeEntryRepository;

    @Mock
    private CapacityAlertRepository capacityAlertRepository;

    @InjectMocks
    private CapacityService capacityService;

    private LocalDate startDate;
    private LocalDate endDate;

    @BeforeEach
    void setUp() {
        startDate = LocalDate.of(2024, 1, 1);
        endDate = LocalDate.of(2024, 1, 7);
    }

    private TimeEntry createTimeEntry(Long userId, Double hours) {
        TimeEntry entry = new TimeEntry();
        entry.setUserId(userId);
        entry.setHoursSpent(hours);
        entry.setDate(startDate);
        return entry;
    }

    @Test
    void testCalculateLoadRateWithKnownValues() {
        // 30 hours logged in a 1-week period with 40h/week capacity = 75%
        when(timeEntryRepository.findByUserIdAndDateBetween(1L, startDate, endDate))
                .thenReturn(Arrays.asList(
                        createTimeEntry(1L, 15.0),
                        createTimeEntry(1L, 15.0)
                ));

        Double loadRate = capacityService.calculateLoadRate(1L, 40.0, startDate, endDate);

        // 7 days = 1 week exactly (7/7.0 = 1.0), capacity = 40, logged = 30 => 75%
        assertEquals(75.0, loadRate, 0.1);
    }

    @Test
    void testUnderloadAlertGeneration() {
        // 20 hours logged in 1 week with 40h capacity = 50% (< 80% => UNDERLOAD)
        when(timeEntryRepository.findByUserIdAndDateBetween(1L, startDate, endDate))
                .thenReturn(Collections.singletonList(createTimeEntry(1L, 20.0)));
        when(capacityAlertRepository.save(any(CapacityAlert.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CapacityAlert alert = capacityService.checkLoadAlerts(1L, 100L, 40.0, startDate, endDate);

        assertNotNull(alert);
        assertEquals(AlertType.UNDERLOAD, alert.getAlertType());
        assertEquals(50.0, alert.getLoadRate(), 0.1);
    }

    @Test
    void testOverloadAlertGeneration() {
        // 45 hours logged in 1 week with 40h capacity = 112.5% (>= 100% => OVERLOAD)
        when(timeEntryRepository.findByUserIdAndDateBetween(1L, startDate, endDate))
                .thenReturn(Collections.singletonList(createTimeEntry(1L, 45.0)));
        when(capacityAlertRepository.save(any(CapacityAlert.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CapacityAlert alert = capacityService.checkLoadAlerts(1L, 100L, 40.0, startDate, endDate);

        assertNotNull(alert);
        assertEquals(AlertType.OVERLOAD, alert.getAlertType());
        assertEquals(112.5, alert.getLoadRate(), 0.1);
    }

    @Test
    void testNormalLoadNoAlertGenerated() {
        // 36 hours logged in 1 week with 40h capacity = 90% (80% <= 90% < 100% => no alert)
        when(timeEntryRepository.findByUserIdAndDateBetween(1L, startDate, endDate))
                .thenReturn(Collections.singletonList(createTimeEntry(1L, 36.0)));

        CapacityAlert alert = capacityService.checkLoadAlerts(1L, 100L, 40.0, startDate, endDate);

        assertNull(alert);
    }
}

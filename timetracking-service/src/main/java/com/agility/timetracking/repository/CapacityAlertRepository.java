package com.agility.timetracking.repository;

import com.agility.timetracking.model.CapacityAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapacityAlertRepository extends JpaRepository<CapacityAlert, Long> {

    List<CapacityAlert> findByUserId(Long userId);

    List<CapacityAlert> findBySprintId(Long sprintId);
}

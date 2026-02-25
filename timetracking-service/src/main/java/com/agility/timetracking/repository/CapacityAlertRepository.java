package com.agility.timetracking.repository;

import com.agility.timetracking.model.CapacityAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapacityAlertRepository extends MongoRepository<CapacityAlert, String> {

    List<CapacityAlert> findByUserId(Long userId);

    List<CapacityAlert> findBySprintId(Long sprintId);
}

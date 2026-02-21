package com.agility.task.repository;

import com.agility.task.model.BacklogItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BacklogItemRepository extends JpaRepository<BacklogItem, Long> {

    List<BacklogItem> findByProjectIdOrderByPosition(Long projectId);

    Optional<BacklogItem> findByTaskId(Long taskId);
}

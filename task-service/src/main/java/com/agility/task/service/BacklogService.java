package com.agility.task.service;

import com.agility.task.model.BacklogItem;
import com.agility.task.repository.BacklogItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BacklogService {

    private final BacklogItemRepository backlogItemRepository;

    public BacklogService(BacklogItemRepository backlogItemRepository) {
        this.backlogItemRepository = backlogItemRepository;
    }

    public List<BacklogItem> findByProjectId(Long projectId) {
        return backlogItemRepository.findByProjectIdOrderByPosition(projectId);
    }

    public Optional<BacklogItem> findById(Long id) {
        return backlogItemRepository.findById(id);
    }

    public Optional<BacklogItem> findByTaskId(Long taskId) {
        return backlogItemRepository.findByTaskId(taskId);
    }

    public BacklogItem addToBacklog(BacklogItem item) {
        return backlogItemRepository.save(item);
    }

    public BacklogItem reorder(Long id, Integer newPosition) {
        BacklogItem item = backlogItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Backlog item not found with id: " + id));
        item.setPosition(newPosition);
        return backlogItemRepository.save(item);
    }

    public void removeFromBacklog(Long id) {
        backlogItemRepository.deleteById(id);
    }
}

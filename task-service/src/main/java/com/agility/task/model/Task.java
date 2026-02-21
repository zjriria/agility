package com.agility.task.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    private String id;

    private String title;

    private String description;

    private TaskType type = TaskType.USER_STORY;

    private TaskStatus status = TaskStatus.TODO;

    private TaskPriority priority = TaskPriority.MEDIUM;

    private Double estimation;

    private Long assigneeId;

    private Long sprintId;

    private Long projectId;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}

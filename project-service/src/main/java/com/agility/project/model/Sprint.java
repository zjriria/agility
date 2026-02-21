package com.agility.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sprints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer number;

    private String goal;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer durationWeeks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SprintStatus status = SprintStatus.PLANNED;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum SprintStatus {
        PLANNED, ACTIVE, COMPLETED
    }
}

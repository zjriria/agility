package com.agility.project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private Methodology methodology;

    private Double theoreticalCapacity;

    private LocalDateTime createdAt;

    public Project() {
    }

    public Project(String name, String description, Methodology methodology, Double theoreticalCapacity, LocalDateTime createdAt) {
        this.name = name;
        this.description = description;
        this.methodology = methodology;
        this.theoreticalCapacity = theoreticalCapacity;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Methodology getMethodology() {
        return methodology;
    }

    public void setMethodology(Methodology methodology) {
        this.methodology = methodology;
    }

    public Double getTheoreticalCapacity() {
        return theoreticalCapacity;
    }

    public void setTheoreticalCapacity(Double theoreticalCapacity) {
        this.theoreticalCapacity = theoreticalCapacity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

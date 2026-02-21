package com.agility.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "developer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeveloperProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @ElementCollection
    @CollectionTable(name = "developer_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Column(nullable = false)
    private Double weeklyCapacityHours = 40.0;

    @ElementCollection
    @CollectionTable(name = "developer_absences", joinColumns = @JoinColumn(name = "profile_id"))
    private List<AbsencePeriod> absences;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AbsencePeriod {
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }
}

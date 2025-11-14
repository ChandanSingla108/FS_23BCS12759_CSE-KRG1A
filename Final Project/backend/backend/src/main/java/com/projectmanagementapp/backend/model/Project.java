package com.projectmanagementapp.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // ✅ Keep default list when using @Builder
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_team_members", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "email")
    @Builder.Default
    private List<String> teamMembers = new ArrayList<>();

    // ✅ Default timestamp will stay
    @Builder.Default
    private Instant createdAt = Instant.now();
}

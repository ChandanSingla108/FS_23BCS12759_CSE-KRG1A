package com.projectmanagementapp.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // status: TODO / IN_PROGRESS / DONE
    @Builder.Default
    @Column(nullable = false)
    private String status = "TODO";

    // optional assignee email
    private String assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    // ✅ Keep default timestamp
    @Builder.Default
    private Instant createdAt = Instant.now();
}

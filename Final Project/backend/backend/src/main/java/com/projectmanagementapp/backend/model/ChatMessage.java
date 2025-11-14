// src/main/java/com/projectmanagementapp/backend/model/ChatMessage.java
package com.projectmanagementapp.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String message;

    @Builder.Default
    private Instant sentAt = Instant.now();
}

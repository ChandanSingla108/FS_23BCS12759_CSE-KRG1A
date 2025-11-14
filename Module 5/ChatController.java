// src/main/java/com/projectmanagementapp/backend/controller/ChatController.java
package com.projectmanagementapp.backend.controller;

import com.projectmanagementapp.backend.model.ChatMessage;
import com.projectmanagementapp.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping
    public List<ChatMessage> getAllMessages() {
        return chatService.getAll();
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessage msg) {
        return ResponseEntity.ok(chatService.save(msg));
    }
}

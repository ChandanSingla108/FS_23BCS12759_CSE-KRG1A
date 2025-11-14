package com.projectmanagementapp.backend.controller;

import com.projectmanagementapp.backend.model.User;
import com.projectmanagementapp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Register a new user
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<User> existingUser = userService.getUserByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                response.put("success", false);
                response.put("message", "User already exists!");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            User savedUser = userService.saveUser(user);
            response.put("success", true);
            response.put("message", "User registered successfully!");
            response.put("user", savedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error occurred while registering user.");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    // POST /api/users/login
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> payload) {
    Map<String, Object> resp = new HashMap<>();
    String email = payload.get("email");
    String password = payload.get("password");

    try {
        Optional<User> opt = userService.getUserByEmail(email);
        if (opt.isEmpty()) {
            resp.put("success", false);
            resp.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
        }

        User user = opt.get();

        // NOTE: currently passwords are plain text in DB.
        // If you later hash them with BCrypt, replace this with BCrypt check.
        if (!user.getPassword().equals(password)) {
            resp.put("success", false);
            resp.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }

        // Success: return basic user info (avoid sending password)
        Map<String, Object> userDto = new HashMap<>();
        userDto.put("id", user.getId());
        userDto.put("name", user.getName());
        userDto.put("email", user.getEmail());
        userDto.put("role", user.getRole());

        resp.put("success", true);
        resp.put("message", "Login successful");
        resp.put("user", userDto);

        return ResponseEntity.ok(resp);

    } catch (Exception e) {
        resp.put("success", false);
        resp.put("message", "Server error during login");
        resp.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
    }
}

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}

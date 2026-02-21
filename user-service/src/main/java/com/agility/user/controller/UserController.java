package com.agility.user.controller;

import com.agility.user.model.DeveloperProfile;
import com.agility.user.model.Team;
import com.agility.user.model.User;
import com.agility.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/api/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/api/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @GetMapping("/api/users/{id}/profile")
    public ResponseEntity<DeveloperProfile> getDeveloperProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getDeveloperProfile(id));
    }

    @PutMapping("/api/users/{id}/profile")
    public ResponseEntity<DeveloperProfile> updateDeveloperProfile(
            @PathVariable Long id,
            @RequestBody DeveloperProfile profile) {
        return ResponseEntity.ok(userService.updateDeveloperProfile(id, profile));
    }

    @GetMapping("/api/teams")
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(userService.getAllTeams());
    }

    @PostMapping("/api/teams")
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(userService.createTeam(team));
    }
}

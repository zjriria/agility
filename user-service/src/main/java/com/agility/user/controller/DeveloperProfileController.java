package com.agility.user.controller;

import com.agility.user.model.DeveloperProfile;
import com.agility.user.service.DeveloperProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/profiles")
public class DeveloperProfileController {

    private final DeveloperProfileService developerProfileService;

    public DeveloperProfileController(DeveloperProfileService developerProfileService) {
        this.developerProfileService = developerProfileService;
    }

    @GetMapping
    public ResponseEntity<List<DeveloperProfile>> getAllProfiles() {
        return ResponseEntity.ok(developerProfileService.getAllProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeveloperProfile> getProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(developerProfileService.getProfileById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DeveloperProfile> getProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(developerProfileService.getProfileByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<DeveloperProfile> createProfile(@RequestBody DeveloperProfile profile) {
        return ResponseEntity.ok(developerProfileService.createProfile(profile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeveloperProfile> updateProfile(@PathVariable Long id, @RequestBody DeveloperProfile profile) {
        return ResponseEntity.ok(developerProfileService.updateProfile(id, profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        developerProfileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}

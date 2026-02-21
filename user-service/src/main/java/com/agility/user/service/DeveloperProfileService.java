package com.agility.user.service;

import com.agility.user.model.DeveloperProfile;
import com.agility.user.repository.DeveloperProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeveloperProfileService {

    private final DeveloperProfileRepository developerProfileRepository;

    public DeveloperProfileService(DeveloperProfileRepository developerProfileRepository) {
        this.developerProfileRepository = developerProfileRepository;
    }

    public List<DeveloperProfile> getAllProfiles() {
        return developerProfileRepository.findAll();
    }

    public DeveloperProfile getProfileById(Long id) {
        return developerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Developer profile not found with id: " + id));
    }

    public DeveloperProfile getProfileByUserId(Long userId) {
        return developerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Developer profile not found for user id: " + userId));
    }

    public DeveloperProfile createProfile(DeveloperProfile profile) {
        return developerProfileRepository.save(profile);
    }

    public DeveloperProfile updateProfile(Long id, DeveloperProfile profile) {
        DeveloperProfile existingProfile = getProfileById(id);
        existingProfile.setUserId(profile.getUserId());
        existingProfile.setSkills(profile.getSkills());
        existingProfile.setWeeklyCapacityHours(profile.getWeeklyCapacityHours());
        existingProfile.setAvailable(profile.getAvailable());
        return developerProfileRepository.save(existingProfile);
    }

    public void deleteProfile(Long id) {
        developerProfileRepository.deleteById(id);
    }
}

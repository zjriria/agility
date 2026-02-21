package com.agility.user.service;

import com.agility.user.model.User;
import com.agility.user.model.DeveloperProfile;
import com.agility.user.model.Team;
import com.agility.user.repository.UserRepository;
import com.agility.user.repository.DeveloperProfileRepository;
import com.agility.user.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DeveloperProfileRepository developerProfileRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateUser(Long id, User updatedUser) {
        User user = getUserById(id);
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        user.setTeamId(updatedUser.getTeamId());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        return userRepository.save(user);
    }

    public DeveloperProfile getDeveloperProfile(Long userId) {
        return developerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DeveloperProfile profile = new DeveloperProfile();
                    profile.setUserId(userId);
                    return developerProfileRepository.save(profile);
                });
    }

    public DeveloperProfile updateDeveloperProfile(Long userId, DeveloperProfile profile) {
        DeveloperProfile existing = developerProfileRepository.findByUserId(userId)
                .orElse(new DeveloperProfile());
        existing.setUserId(userId);
        existing.setSkills(profile.getSkills());
        existing.setWeeklyCapacityHours(profile.getWeeklyCapacityHours());
        existing.setAbsences(profile.getAbsences());
        return developerProfileRepository.save(existing);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }
}

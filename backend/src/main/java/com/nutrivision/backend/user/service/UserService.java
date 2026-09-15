package com.nutrivision.backend.user.service;

import com.nutrivision.backend.user.dto.UpdateUserRequest;
import com.nutrivision.backend.user.dto.UserResponse;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getCurrentUser(Long userId) {
        User user = findUserById(userId);
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateCurrentUser(
            Long userId,
            UpdateUserRequest request
    ) {
        User user = findUserById(userId);

        user.setName(request.name());

        return toResponse(userRepository.save(user));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
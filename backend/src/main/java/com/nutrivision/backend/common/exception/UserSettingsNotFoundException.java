package com.nutrivision.backend.common.exception;

public class UserSettingsNotFoundException extends RuntimeException {
    public UserSettingsNotFoundException(String message) {
        super(message);
    }
}

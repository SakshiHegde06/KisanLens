package com.kisanlens.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Placeholder for future push/SMS notifications (e.g. "your diagnosis is
 * ready", "high-severity disease detected"). Not wired into the scan flows
 * yet - logging only, so the seam exists without adding a real dependency
 * (Firebase, Twilio, etc.) that the capstone doesn't need.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void notifyUser(String userId, String message) {
        log.info("[notification stub] to user {}: {}", userId, message);
    }
}

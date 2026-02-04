package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.NotificatioDTO.GetNotificationForUserRequestDTO;
import org.example.padelmaniacbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/getNotificationsForUser")
    public ResponseEntity<?> getNotificationsForUser(@RequestBody  GetNotificationForUserRequestDTO getNotificationForUserRequestDTO){
        return ResponseEntity.ok(ApiResponse
                .success(notificationService.getNotificationForPlayer(getNotificationForUserRequestDTO.getPlayerId())));
    }
}

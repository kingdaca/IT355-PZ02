package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.NotificatioDTO.NotificationDTO;

import java.util.List;

public interface NotificationService {

    List<NotificationDTO> getNotificationForPlayer(Long playerId);

    void reedNotification(Long id);
}

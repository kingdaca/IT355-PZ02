package org.example.padelmaniacbackend.service.impl;

import org.example.padelmaniacbackend.DTOs.NotificatioDTO.NotificationDTO;
import org.example.padelmaniacbackend.exeption.ResourceNotFoundException;
import org.example.padelmaniacbackend.model.Notification;
import org.example.padelmaniacbackend.repository.NotificationRepository;
import org.example.padelmaniacbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;


    @Override
    public List<NotificationDTO> getNotificationForPlayer(Long playerId) {
        List<Notification> notifications = notificationRepository.findNotificationsByPlayerId(playerId);
        if(notifications.isEmpty()){
            return new ArrayList<>();
        }
        return  notifications.stream().map(this::convertToNotificatioDTO).collect(Collectors.toList());
    }

    @Override
    public void reedNotification(Long id) {
        Notification notification = notificationRepository.findNotificationById(id);
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationDTO convertToNotificatioDTO(Notification notification){
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setRead(notification.isRead());
        notificationDTO.setMessage(notification.getMessage());
        notificationDTO.setPlayerId(notification.getPlayer().getId());
        return notificationDTO;
    }
}

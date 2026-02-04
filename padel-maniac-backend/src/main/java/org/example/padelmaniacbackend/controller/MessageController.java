package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTOs.NotificatioDTO.NotificationDTO;
import org.example.padelmaniacbackend.model.Notification;
import org.example.padelmaniacbackend.repository.NotificationRepository;
import org.example.padelmaniacbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class MessageController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    @MessageMapping("reed-notification")
    private void updateNotification(Long notificationId){
        System.out.println("aaa" +  notificationId);
        notificationService.reedNotification(notificationId);
    }

    @MessageMapping("reed-all-notification")
    private void updateAllNotification(Long playerId){
        List<NotificationDTO> notifications = notificationService.getNotificationForPlayer(playerId);
        for (NotificationDTO notification : notifications) {
            Notification n = notificationRepository.findNotificationById(notification.getId());
            n.setRead(true);
            notificationRepository.save(n);
        }
    }

    @MessageMapping("remove-all-notification")
    private void removeAllNotificationsForPLayer(Long playerId){
        List<NotificationDTO> notifications = notificationService.getNotificationForPlayer(playerId);
        for (NotificationDTO notification : notifications) {
            Notification n = notificationRepository.findNotificationById(notification.getId());
            n.setRead(true);
            notificationRepository.delete(n);
        }
    }

}

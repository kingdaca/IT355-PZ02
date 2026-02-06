package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.NotificatioDTO.NotificationDTO;
import org.example.padelmaniacbackend.model.City;
import org.example.padelmaniacbackend.model.Player;

import java.util.List;

public interface NotificationService {

    List<NotificationDTO> getNotificationForPlayer(Long playerId);

    void reedNotification(Long id);

     void sendNotification(Player p, String message);

     void sendToNearbyCourts(City city);
}

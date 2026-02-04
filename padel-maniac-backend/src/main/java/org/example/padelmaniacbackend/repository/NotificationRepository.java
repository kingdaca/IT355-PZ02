package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {


    @Query("select n from  Notification n where n.player.id = :playerId")
    List<Notification> findNotificationsByPlayerId(@Param("playerId") Long playerId);

    Notification findNotificationById(Long id);
}

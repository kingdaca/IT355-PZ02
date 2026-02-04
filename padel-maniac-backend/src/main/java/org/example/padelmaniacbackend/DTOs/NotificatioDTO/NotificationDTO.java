package org.example.padelmaniacbackend.DTOs.NotificatioDTO;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.model.Player;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NotificationDTO {

    private Long id;
    private Long playerId;
    private String message;
    private boolean isRead = false;
    private LocalDateTime sentAt;
}

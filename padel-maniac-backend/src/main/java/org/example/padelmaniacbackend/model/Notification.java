package org.example.padelmaniacbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;
    private String message;
    private boolean isRead = false;
    private LocalDateTime sentAt;


    public Notification(String message, LocalDateTime now, Player matchOrganizer) {
    }
}

package org.example.padelmaniacbackend.DTOs.matchDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.model.Match;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MatchDTO {

    private Long id;
    private int freePosition;
    private String location;
    List<PlayerDTO> players;
    List<PlayerDTO> potentialPlayers;
    private LocalDate matchDay;
    private Match.MatchStatus matchStatus;
    private boolean needReservation;
    private float matchDuration;
    private LocalTime matchAroundTime;
    private LocalTime matchScheduledTime;
    private PlayerDTO matchOrganizer;
    private String notes;
    private CourtDTO court;
}

package org.example.padelmaniacbackend.DTO.matchDTO;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.DTO.City.CityDTO;
import org.example.padelmaniacbackend.DTO.Court.CourtDTO;
import org.example.padelmaniacbackend.DTO.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.model.City;
import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Player;

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
    private LocalDate matchDay;
    private Match.MatchStatus matchStatus;
    private LocalTime matchAroundTime;
    private LocalTime matchConfirmedTime;
    private PlayerDTO matchOrganizer;
    private String notes;
    private CourtDTO court;
}

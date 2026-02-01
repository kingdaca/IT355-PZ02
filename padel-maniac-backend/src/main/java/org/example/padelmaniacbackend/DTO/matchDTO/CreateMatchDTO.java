package org.example.padelmaniacbackend.DTO.matchDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreateMatchDTO {

    private int numberOfPlayers;
    private LocalDate date;
    private LocalTime matchAroundTime;
    private float matchDuration;
    private String city;
    private String notes;

}

package org.example.padelmaniacbackend.DTO.matchDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreateMatchDTO {

    private int numberOfPlayers;
    private LocalDate date;
    private String city;
    private String notes;
    private String username;

}

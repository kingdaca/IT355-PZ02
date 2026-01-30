package org.example.padelmaniacbackend.DTO.playerDTO;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.model.Role;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PlayerDTO {
    private Long id;
    private String username;
//    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Player.Level level;




}

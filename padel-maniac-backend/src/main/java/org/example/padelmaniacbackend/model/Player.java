package org.example.padelmaniacbackend.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Enumerated(EnumType.STRING)
    private Level level;

    @ManyToMany(mappedBy = "players")
    private List<Match> matches;

    @OneToMany(mappedBy = "matchOrganizer", cascade = CascadeType.ALL)
    private List<Match> organizedMatches = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "court_id")
    private Court court;

    public enum Level{
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}


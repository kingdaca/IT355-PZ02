package org.example.padelmaniacbackend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Getter
@Setter
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
    @JsonIgnore
    private Role role;

    @Enumerated(EnumType.STRING)
    private Level level;

    @ManyToMany(mappedBy = "players")
    @JsonIgnore
    private List<Match> matches;

    @OneToMany(mappedBy = "matchOrganizer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Match> organizedMatches = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "court_id")
    @JsonIgnore
    private Court court;

    @OneToMany(mappedBy = "player")
    private Set<OfferVote> votes = new HashSet<>();

    public enum Level{
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}


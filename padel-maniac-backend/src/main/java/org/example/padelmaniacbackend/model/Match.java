package org.example.padelmaniacbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "player_match",
            joinColumns = @JoinColumn(name = "match_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    private List<Player> players;

    private int freePosition;
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City location;

    private LocalDate matchDay;
    private LocalTime matchAroundTime;
    private LocalTime matchConfirmedTime;
    private float matchDuration;

    private double price;

    @Enumerated(EnumType.STRING)
    private MatchStatus matchStatus;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private Player matchOrganizer;

    private String notes;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<CourtOffer> courtOffers = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "court_id")
    private Court court;

    public enum MatchStatus {
        OPEN, CANCELED, FULL, ONGOING , ENDED
    }
}




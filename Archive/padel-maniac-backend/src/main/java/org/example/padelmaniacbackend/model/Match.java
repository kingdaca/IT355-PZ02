package org.example.padelmaniacbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
    @JsonIgnore
    private List<Player> players;

    private int freePosition;
    @ManyToOne
    @JoinColumn(name = "city_id")
    @JsonIgnore
    private City location;

    private LocalDate matchDay;
    private LocalTime matchAroundTime;
    private LocalTime matchScheduledTime;
    private float matchDuration;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private MatchStatus matchStatus;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    @JsonIgnore
    private Player matchOrganizer;

    private String notes;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Offer> offers = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "court_id")
    @JsonIgnore
    private Court court;

    public enum MatchStatus {
        OPEN, CANCELED, FULL, ONGOING , ENDED, SCHEDULED
    }
}




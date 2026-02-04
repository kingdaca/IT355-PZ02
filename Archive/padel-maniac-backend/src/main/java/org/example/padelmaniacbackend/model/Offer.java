package org.example.padelmaniacbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    private BigDecimal offeredPrice;  // Cena za ovaj meč
    private LocalTime offerTime;
    private String notes;
    @Enumerated(EnumType.STRING)
    private OfferStatus status;

    @OneToMany(mappedBy = "offer")
    private Set<OfferVote> votes = new HashSet<>();


    public enum OfferStatus{
        PENDING, ACCEPTED, REJECTED, CONFIRMED
    }


}

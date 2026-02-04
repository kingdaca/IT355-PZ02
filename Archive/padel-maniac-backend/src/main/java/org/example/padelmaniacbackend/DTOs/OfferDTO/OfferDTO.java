package org.example.padelmaniacbackend.DTOs.OfferDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Offer;
import org.example.padelmaniacbackend.model.OfferVote;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OfferDTO {

    private Long id;
    private CourtDTO court;
    private BigDecimal offeredPrice;
    private LocalTime offerTime;
    private String notes;
    private MatchDTO match;
    private Offer.OfferStatus status;
    private Set<OfferVoteDTO> votes;
}

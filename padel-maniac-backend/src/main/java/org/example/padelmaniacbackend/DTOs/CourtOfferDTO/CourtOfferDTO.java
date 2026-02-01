package org.example.padelmaniacbackend.DTOs.CourtOfferDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.model.CourtOffer;
import org.example.padelmaniacbackend.model.Match;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CourtOfferDTO {

    private Long id;
    private CourtDTO court;
    private BigDecimal offeredPrice;
    private LocalTime offerTime;
    private String notes;
    private CourtOffer.OfferStatus status;
}

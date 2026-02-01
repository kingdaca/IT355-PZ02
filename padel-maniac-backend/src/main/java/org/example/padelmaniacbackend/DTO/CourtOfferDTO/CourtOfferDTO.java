package org.example.padelmaniacbackend.DTO.CourtOfferDTO;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.model.Match;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CourtOfferDTO {

    private Long id;
    private Match match;
    private Court court;
    private BigDecimal offeredPrice;
    private LocalDateTime offerTime;
    private String notes;
    private String status;
}

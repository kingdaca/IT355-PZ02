package org.example.padelmaniacbackend.DTOs.OfferVoteDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OfferVoteRequestDTO {

    private Long offerId;
    private Long playerId;
}

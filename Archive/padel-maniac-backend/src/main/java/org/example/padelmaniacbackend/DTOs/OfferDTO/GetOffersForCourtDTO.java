package org.example.padelmaniacbackend.DTOs.OfferDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetOffersForCourtDTO {

    private Long playerId;
}

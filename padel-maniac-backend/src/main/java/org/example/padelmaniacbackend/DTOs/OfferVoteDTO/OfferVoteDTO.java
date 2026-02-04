package org.example.padelmaniacbackend.DTOs.OfferVoteDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.example.padelmaniacbackend.DTOs.OfferDTO.OfferDTO;
import org.example.padelmaniacbackend.DTOs.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.model.Offer;
import org.example.padelmaniacbackend.model.Player;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OfferVoteDTO {

    private OfferDTO offer;
    private PlayerDTO player;

}

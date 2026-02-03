package org.example.padelmaniacbackend.DTOs.OfferDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreatOfferDTO {

    private Long userId;
    private Long matchId;
    private LocalTime time;
    private BigDecimal price;
    private String notes;

}

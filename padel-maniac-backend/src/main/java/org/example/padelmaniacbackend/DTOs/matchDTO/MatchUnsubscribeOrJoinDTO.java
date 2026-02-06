package org.example.padelmaniacbackend.DTOs.matchDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MatchUnsubscribeOrJoinDTO {
    private Long playerId;
    private Long matchId;
}

package org.example.padelmaniacbackend.DTOs.NotificatioDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetNotificationForUserRequestDTO {
    private Long playerId;
}

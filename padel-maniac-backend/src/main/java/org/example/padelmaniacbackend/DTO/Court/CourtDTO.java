package org.example.padelmaniacbackend.DTO.Court;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CourtDTO {

    private Long id;

    private String city;
    private String courtName;
    private String Address;
    private String phone;
}

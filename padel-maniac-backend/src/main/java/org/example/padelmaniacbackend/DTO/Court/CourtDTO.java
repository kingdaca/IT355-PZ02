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

    private String courtName;
    private String Addres;
    private String phone;
}

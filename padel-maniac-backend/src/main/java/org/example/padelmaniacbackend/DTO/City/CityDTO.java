package org.example.padelmaniacbackend.DTO.City;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CityDTO {

    private Long id;
    private String name;
}

package org.example.padelmaniacbackend.DTOs.registration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.java.Log;
import org.example.padelmaniacbackend.model.City;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CourtOwnerRegistrationDTO {

    private Long id;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Long cityId;
    private String courtName;
    private String address;
    private String courtPhone;

}

package org.example.padelmaniacbackend.DTO.registration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistrationDTO {

    private String username;
    private String password;
    private String email;
    private String firstname;
    private String lastName;
    private String phone;

}

package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTO.registration.RegistrationDTO;
import org.example.padelmaniacbackend.model.Player;

public interface AuthService {

    public Player login(String username);

    public Player registration(RegistrationDTO registrationDTO);
}

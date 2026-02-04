package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.registration.RegistrationDTO;
import org.example.padelmaniacbackend.model.Player;

import java.util.Optional;

public interface AuthService {

    public Player login(String username);

    public Player registration(RegistrationDTO registrationDTO);
}

package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.model.Player;

public interface LoginService {

    public Player login(String username, String password);
}

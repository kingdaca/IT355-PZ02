package org.example.padelmaniacbackend.service.impl;

import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.repository.LoginRepository;
import org.example.padelmaniacbackend.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    LoginRepository loginRepository;
    @Override
    public Player login(String username, String password) {
        return loginRepository.findByUsernameAndPassword(username,password);
    }
}

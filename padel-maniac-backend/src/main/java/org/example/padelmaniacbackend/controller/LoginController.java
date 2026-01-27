package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTO.auth.LoginDTO;
import org.example.padelmaniacbackend.DTO.auth.LoginReponse;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.security.JwtTokenProvider;
import org.example.padelmaniacbackend.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginDTO loginDTO){
        Player player = loginService.login(loginDTO.getUsername(),loginDTO.getPassword());
        if(player != null){
            String role = String.valueOf(player.getRole().getRole());
            String token = jwtTokenProvider.generateToken(player.getUsername(),role);
            return ResponseEntity.ok(new LoginReponse(token));
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Wrong username or password");
        }
    }
}

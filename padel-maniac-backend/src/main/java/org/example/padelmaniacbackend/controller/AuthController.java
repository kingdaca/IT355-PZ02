package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.DTO.auth.LoginDTO;
import org.example.padelmaniacbackend.DTO.auth.LoginReponseDTO;
import org.example.padelmaniacbackend.DTO.registration.RegistrationDTO;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.security.JwtTokenProvider;
import org.example.padelmaniacbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginDTO loginDTO){
        Player player = authService.login(loginDTO.getUsername());
        if(player != null){
            boolean matches = passwordEncoder.matches(loginDTO.getPassword(), player.getPassword());
            if(matches){
                String role = String.valueOf(player.getRole().getName());
                String token = jwtTokenProvider.generateToken(player.getUsername(),role);
                return ResponseEntity.ok(new LoginReponseDTO(token));
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Wrong username or password");
            }
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Wrong username or password");
        }
    }

    @PostMapping("/registration")
    public ResponseEntity<?> Registration(@RequestBody RegistrationDTO registrationDTO){
        if(playerRepository.existsByUsernameAndEmail(registrationDTO.getUsername(),registrationDTO.getEmail())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exist");
        }
        registrationDTO.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        authService.registration(registrationDTO);
        return ResponseEntity.ok("OK");
    }

}

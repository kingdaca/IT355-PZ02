package org.example.padelmaniacbackend.controller;

import org.example.padelmaniacbackend.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/city")
public class CityController {

    @Autowired
    private CityRepository cityRepository;

    @GetMapping("/cities")
    public ResponseEntity<?> getAllCities(){
        return ResponseEntity.ok(ApiResponse.success(cityRepository.findAll()));
    }
}

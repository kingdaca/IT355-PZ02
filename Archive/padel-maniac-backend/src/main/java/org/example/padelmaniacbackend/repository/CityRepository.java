package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {

    List<City> findAll();

    City findByName(String name);

    City findById(Long id);
}

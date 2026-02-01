package org.example.padelmaniacbackend.repository;

import org.example.padelmaniacbackend.model.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourtRepository extends JpaRepository<Court, Integer> {

    Court findById(Long id);
}

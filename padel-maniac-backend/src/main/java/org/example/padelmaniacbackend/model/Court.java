package org.example.padelmaniacbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;
    private String courtName;
    private String address;
    private String phone;

    @OneToMany(mappedBy = "court")
    private List<CourtOffer> offers = new ArrayList<>();
}

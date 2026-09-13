package com.kisanlens.treatment;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TreatmentRepository extends MongoRepository<TreatmentEntry, String> {

    Optional<TreatmentEntry> findByDiseaseNameIgnoreCase(String diseaseName);
}

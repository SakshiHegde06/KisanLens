package com.kisanlens.recommendation;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CropRepository extends MongoRepository<Crop, String> {

    List<Crop> findBySuitableSoilTypesContaining(String soilType);
}

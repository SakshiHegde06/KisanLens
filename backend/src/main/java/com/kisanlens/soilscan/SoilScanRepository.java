package com.kisanlens.soilscan;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SoilScanRepository extends MongoRepository<SoilScan, String> {

    List<SoilScan> findByUserIdOrderByCreatedAtDesc(String userId);
}

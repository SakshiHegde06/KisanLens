package com.kisanlens.diseasescan;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DiseaseScanRepository extends MongoRepository<DiseaseScan, String> {

    List<DiseaseScan> findByUserIdOrderByCreatedAtDesc(String userId);
}

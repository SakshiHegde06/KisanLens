package com.kisanlens.field;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FieldRepository extends MongoRepository<Field, String> {

    List<Field> findByOwnerId(String ownerId);
}

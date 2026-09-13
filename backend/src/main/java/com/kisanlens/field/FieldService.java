package com.kisanlens.field;

import com.kisanlens.common.exception.ResourceNotFoundException;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldService {

    private final FieldRepository fieldRepository;

    public FieldService(FieldRepository fieldRepository) {
        this.fieldRepository = fieldRepository;
    }

    public Field create(String ownerId, String name, double latitude, double longitude) {
        // GeoJsonPoint takes (longitude, latitude) - the opposite order to
        // how humans usually say coordinates - easy to swap by accident.
        Field field = new Field(ownerId, name, new GeoJsonPoint(longitude, latitude));
        return fieldRepository.save(field);
    }

    public List<Field> getForOwner(String ownerId) {
        return fieldRepository.findByOwnerId(ownerId);
    }

    public Field getById(String id) {
        return fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field not found: " + id));
    }

    public void updateLastKnownSoilType(String fieldId, String soilType) {
        Field field = getById(fieldId);
        field.setLastKnownSoilType(soilType);
        fieldRepository.save(field);
    }
}

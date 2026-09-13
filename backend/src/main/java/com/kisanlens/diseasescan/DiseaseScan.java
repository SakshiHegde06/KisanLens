package com.kisanlens.diseasescan;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("disease_scans")
public class DiseaseScan {

    @Id
    private String id;

    private String userId;

    private String imageRef;

    private ScanStatus status = ScanStatus.PENDING;

    private String disease;

    private double confidence;

    private String severity;

    private List<String> treatmentPrecautions;

    private List<String> treatmentDosage;

    private String treatmentNotes;

    private Instant createdAt = Instant.now();

    public DiseaseScan() {
    }

    public DiseaseScan(String userId, String imageRef) {
        this.userId = userId;
        this.imageRef = imageRef;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getImageRef() {
        return imageRef;
    }

    public void setImageRef(String imageRef) {
        this.imageRef = imageRef;
    }

    public ScanStatus getStatus() {
        return status;
    }

    public void setStatus(ScanStatus status) {
        this.status = status;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public List<String> getTreatmentPrecautions() {
        return treatmentPrecautions;
    }

    public void setTreatmentPrecautions(List<String> treatmentPrecautions) {
        this.treatmentPrecautions = treatmentPrecautions;
    }

    public List<String> getTreatmentDosage() {
        return treatmentDosage;
    }

    public void setTreatmentDosage(List<String> treatmentDosage) {
        this.treatmentDosage = treatmentDosage;
    }

    public String getTreatmentNotes() {
        return treatmentNotes;
    }

    public void setTreatmentNotes(String treatmentNotes) {
        this.treatmentNotes = treatmentNotes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public enum ScanStatus {
        PENDING, COMPLETE, FAILED
    }
}

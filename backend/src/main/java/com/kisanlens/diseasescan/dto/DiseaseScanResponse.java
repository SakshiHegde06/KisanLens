package com.kisanlens.diseasescan.dto;

import com.kisanlens.diseasescan.DiseaseScan;

import java.time.Instant;
import java.util.List;

// Matches frontend-web/src/components/DiseaseResultCard.jsx and HistoryPage.jsx:
// { id, disease, confidence, severity, treatment: {precautions, dosage, notes}, createdAt }
public record DiseaseScanResponse(
        String id,
        String disease,
        double confidence,
        String severity,
        TreatmentPlanDto treatment,
        Instant createdAt
) {
    public static DiseaseScanResponse from(DiseaseScan scan) {
        return new DiseaseScanResponse(
                scan.getId(),
                scan.getDisease(),
                scan.getConfidence(),
                scan.getSeverity(),
                new TreatmentPlanDto(
                        scan.getTreatmentPrecautions() != null ? scan.getTreatmentPrecautions() : List.of(),
                        scan.getTreatmentDosage() != null ? scan.getTreatmentDosage() : List.of(),
                        scan.getTreatmentNotes()
                ),
                scan.getCreatedAt()
        );
    }
}

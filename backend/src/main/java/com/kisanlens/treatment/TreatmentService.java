package com.kisanlens.treatment;

import com.kisanlens.diseasescan.dto.TreatmentPlanDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;

    public TreatmentService(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }

    public TreatmentPlanDto lookup(String diseaseName) {
        return treatmentRepository.findByDiseaseNameIgnoreCase(diseaseName)
                .map(entry -> new TreatmentPlanDto(entry.getPrecautions(), entry.getDosage(), entry.getNotes()))
                .orElseGet(this::fallbackPlan);
    }

    // Never fabricate a dosage for a disease we don't have in the KB -
    // the confidence-driven UX principle from the design applies here too:
    // an absent treatment entry is a data gap, not a "no treatment needed".
    private TreatmentPlanDto fallbackPlan() {
        return new TreatmentPlanDto(
                List.of(),
                List.of(),
                "We don't have a treatment plan on file for this diagnosis yet. Please consult a local agricultural extension officer before applying any treatment."
        );
    }
}

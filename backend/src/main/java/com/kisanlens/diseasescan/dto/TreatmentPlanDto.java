package com.kisanlens.diseasescan.dto;

import java.util.List;

public record TreatmentPlanDto(List<String> precautions, List<String> dosage, String notes) {
}

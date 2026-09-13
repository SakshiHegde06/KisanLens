package com.kisanlens.treatment;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

// Mostly-static reference data - matched by the disease class name the
// ML service returns. Seed this collection manually or via a data-loader
// script once the disease classifier's label set is finalized.
@Document("treatment_kb")
public class TreatmentEntry {

    @Id
    private String id;

    @Indexed(unique = true)
    private String diseaseName; // must exactly match a label from the disease classifier

    private List<String> precautions;

    private List<String> dosage;

    private String notes;

    public TreatmentEntry() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public List<String> getPrecautions() {
        return precautions;
    }

    public void setPrecautions(List<String> precautions) {
        this.precautions = precautions;
    }

    public List<String> getDosage() {
        return dosage;
    }

    public void setDosage(List<String> dosage) {
        this.dosage = dosage;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

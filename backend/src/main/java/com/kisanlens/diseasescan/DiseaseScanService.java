package com.kisanlens.diseasescan;

import com.kisanlens.common.exception.ResourceNotFoundException;
import com.kisanlens.diseasescan.dto.DiseaseScanResponse;
import com.kisanlens.diseasescan.dto.TreatmentPlanDto;
import com.kisanlens.mlclient.DiseasePredictionResult;
import com.kisanlens.mlclient.MlInferenceClient;
import com.kisanlens.storage.ImageStorageService;
import com.kisanlens.treatment.TreatmentService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class DiseaseScanService {

    private final DiseaseScanRepository diseaseScanRepository;
    private final ImageStorageService imageStorageService;
    private final MlInferenceClient mlInferenceClient;
    private final TreatmentService treatmentService;

    public DiseaseScanService(
            DiseaseScanRepository diseaseScanRepository,
            ImageStorageService imageStorageService,
            MlInferenceClient mlInferenceClient,
            TreatmentService treatmentService
    ) {
        this.diseaseScanRepository = diseaseScanRepository;
        this.imageStorageService = imageStorageService;
        this.mlInferenceClient = mlInferenceClient;
        this.treatmentService = treatmentService;
    }

    public DiseaseScanResponse submitScan(String userId, MultipartFile image) {
        String imageRef = imageStorageService.store(image, "disease");

        DiseaseScan scan = new DiseaseScan(userId, imageRef);
        scan = diseaseScanRepository.save(scan);

        try {
            DiseasePredictionResult prediction = mlInferenceClient.predictDisease(image);
            TreatmentPlanDto treatment = treatmentService.lookup(prediction.disease());

            scan.setDisease(prediction.disease());
            scan.setConfidence(prediction.confidence());
            scan.setSeverity(prediction.severity());
            scan.setTreatmentPrecautions(treatment.precautions());
            scan.setTreatmentDosage(treatment.dosage());
            scan.setTreatmentNotes(treatment.notes());
            scan.setStatus(DiseaseScan.ScanStatus.COMPLETE);
        } catch (RuntimeException ex) {
            scan.setStatus(DiseaseScan.ScanStatus.FAILED);
            diseaseScanRepository.save(scan);
            throw ex;
        }

        scan = diseaseScanRepository.save(scan);
        return DiseaseScanResponse.from(scan);
    }

    public List<DiseaseScanResponse> getHistory(String userId) {
        return diseaseScanRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(DiseaseScanResponse::from)
                .toList();
    }

    public DiseaseScanResponse getById(String id, String userId) {
        DiseaseScan scan = diseaseScanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disease scan not found: " + id));

        if (!scan.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Disease scan not found: " + id);
        }

        return DiseaseScanResponse.from(scan);
    }
}

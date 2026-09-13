package com.kisanlens.mlclient;

import com.kisanlens.common.exception.MlServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;

/**
 * Talks to the separate FastAPI ml-service over REST (Option B from the
 * architecture discussion). Keeping this as its own component means the
 * rest of the backend never needs to know how inference is actually served -
 * if this were later swapped for in-process ONNX, only this file would change.
 */
@Component
public class MlInferenceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public MlInferenceClient(
            RestTemplate restTemplate,
            @Value("${kisanlens.ml-service.base-url}") String baseUrl
    ) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public SoilPredictionResult predictSoil(MultipartFile image) {
        HttpEntity<MultiValueMap<String, HttpEntity<?>>> requestEntity = buildMultipartRequest(image);
        try {
            return restTemplate.postForObject(
                    baseUrl + "/predict/soil", requestEntity, SoilPredictionResult.class
            );
        } catch (RestClientException e) {
            throw new MlServiceUnavailableException("Soil prediction failed", e);
        }
    }

    public DiseasePredictionResult predictDisease(MultipartFile image) {
        HttpEntity<MultiValueMap<String, HttpEntity<?>>> requestEntity = buildMultipartRequest(image);
        try {
            return restTemplate.postForObject(
                    baseUrl + "/predict/disease", requestEntity, DiseasePredictionResult.class
            );
        } catch (RestClientException e) {
            throw new MlServiceUnavailableException("Disease prediction failed", e);
        }
    }

    private HttpEntity<MultiValueMap<String, HttpEntity<?>>> buildMultipartRequest(MultipartFile image) {
        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", image.getBytes())
                    .filename(image.getOriginalFilename() != null ? image.getOriginalFilename() : "upload.jpg")
                    .contentType(MediaType.IMAGE_JPEG);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            return new HttpEntity<>(builder.build(), headers);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read uploaded image bytes", e);
        }
    }
}

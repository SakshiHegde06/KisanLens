package com.kisanlens.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    /**
     * Persists the uploaded image and returns a reference (path or URL)
     * that can be stored on the scan document and later resolved back
     * to bytes for the ML service call.
     */
    String store(MultipartFile file, String subfolder);

    byte[] readBytes(String storedReference);
}

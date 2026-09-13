package com.kisanlens.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class LocalDiskStorageService implements ImageStorageService {

    private final Path uploadRoot;

    public LocalDiskStorageService(@Value("${kisanlens.storage.upload-dir}") String uploadDir) {
        this.uploadRoot = Path.of(uploadDir);
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not create upload directory: " + uploadRoot, e);
        }
    }

    @Override
    public String store(MultipartFile file, String subfolder) {
        try {
            Path targetDir = uploadRoot.resolve(subfolder);
            Files.createDirectories(targetDir);

            String extension = extractExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename);

            file.transferTo(targetPath);

            // Stored as a relative reference; swap for an S3 key/URL later
            // without touching any calling code, since callers only see this string.
            return subfolder + "/" + filename;
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store uploaded image", e);
        }
    }

    @Override
    public byte[] readBytes(String storedReference) {
        try {
            return Files.readAllBytes(uploadRoot.resolve(storedReference));
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read stored image: " + storedReference, e);
        }
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return ".jpg";
        }
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}

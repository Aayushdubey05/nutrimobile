package com.nutrivision.backend.analysis.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Stores food photos uploaded from the device so an analysis keeps a viewable image.
 * Files are written to {@code app.upload.dir} (a mounted volume in deployment) under
 * generated names; the original client filename is never used.
 */
@Slf4j
@Service
public class ImageStorageService {

    public static final long MAX_IMAGE_BYTES = 10L * 1024 * 1024;

    /** Safe stored-name shape: a UUID plus a known image extension. */
    private static final Pattern STORED_NAME =
            Pattern.compile("[0-9a-fA-F-]{36}\\.(jpg|png|webp|heic)");

    private static final Map<String, String> EXTENSION_BY_MIME = Map.of(
            "image/jpeg", "jpg",
            "image/jpg", "jpg",
            "image/png", "png",
            "image/webp", "webp",
            "image/heic", "heic",
            "image/heif", "heic"
    );

    private final Path uploadDir;

    public ImageStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    /**
     * Validates and writes the upload, returning the generated file name. Takes the
     * bytes rather than the {@link MultipartFile} so the caller can reuse them for
     * the Gemini call without re-reading a consumed stream.
     */
    public String store(byte[] content, String contentType) {
        if (content == null || content.length == 0) {
            throw new IllegalArgumentException("Image file is required");
        }

        if (content.length > MAX_IMAGE_BYTES) {
            throw new IllegalArgumentException(
                    "Image too large: " + content.length + " bytes (max 10MB)");
        }

        String extension = EXTENSION_BY_MIME.get(normalizeMimeType(contentType));

        if (extension == null) {
            throw new IllegalArgumentException(
                    "Unsupported image type: " + contentType
                            + " (allowed: JPEG, PNG, WebP, HEIC)");
        }

        String fileName = UUID.randomUUID() + "." + extension;

        try {
            Files.createDirectories(uploadDir);
            Files.write(uploadDir.resolve(fileName), content);
        } catch (IOException e) {
            throw new AnalysisException("Failed to store uploaded image", e);
        }

        return fileName;
    }

    /**
     * Resolves a previously stored file, rejecting anything that is not a name this
     * service generated (which also rules out path traversal).
     */
    public Path resolveStored(String fileName) {
        if (fileName == null || !STORED_NAME.matcher(fileName).matches()) {
            throw new IllegalArgumentException("Invalid image name");
        }

        Path resolved = uploadDir.resolve(fileName).normalize();

        if (!resolved.startsWith(uploadDir)) {
            throw new IllegalArgumentException("Invalid image name");
        }

        return resolved;
    }

    /** Public path stored on the analysis row and returned to clients. */
    public String toImageUrl(String fileName) {
        return "/api/v1/analysis/images/" + fileName;
    }

    public String contentTypeOf(String fileName) {
        String lower = fileName.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".heic")) return "image/heic";
        return "image/jpeg";
    }

    private String normalizeMimeType(String contentType) {
        if (contentType == null) {
            return "";
        }
        int separator = contentType.indexOf(';');
        String base = separator >= 0 ? contentType.substring(0, separator) : contentType;
        return base.trim().toLowerCase(Locale.ROOT);
    }
}

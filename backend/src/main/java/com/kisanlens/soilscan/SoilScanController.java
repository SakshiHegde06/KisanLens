package com.kisanlens.soilscan;

import com.kisanlens.soilscan.dto.SoilScanResponse;
import com.kisanlens.user.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// Matches frontend-web/src/api/soilScanApi.js:
// POST /scans/soil  multipart: image, latitude, longitude
// GET  /scans/soil
// GET  /scans/soil/{id}
@RestController
@RequestMapping("/scans/soil")
public class SoilScanController {

    private final SoilScanService soilScanService;

    public SoilScanController(SoilScanService soilScanService) {
        this.soilScanService = soilScanService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public SoilScanResponse submit(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("image") MultipartFile image,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude
    ) {
        return soilScanService.submitScan(principal.getId(), image, latitude, longitude);
    }

    @GetMapping
    public List<SoilScanResponse> history(@AuthenticationPrincipal UserPrincipal principal) {
        return soilScanService.getHistory(principal.getId());
    }

    @GetMapping("/{id}")
    public SoilScanResponse getOne(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id
    ) {
        return soilScanService.getById(id, principal.getId());
    }
}

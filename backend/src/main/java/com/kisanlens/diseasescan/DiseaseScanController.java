package com.kisanlens.diseasescan;

import com.kisanlens.diseasescan.dto.DiseaseScanResponse;
import com.kisanlens.user.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// Matches frontend-web/src/api/diseaseScanApi.js:
// POST /scans/disease  multipart: image
// GET  /scans/disease
// GET  /scans/disease/{id}
@RestController
@RequestMapping("/scans/disease")
public class DiseaseScanController {

    private final DiseaseScanService diseaseScanService;

    public DiseaseScanController(DiseaseScanService diseaseScanService) {
        this.diseaseScanService = diseaseScanService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public DiseaseScanResponse submit(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("image") MultipartFile image
    ) {
        return diseaseScanService.submitScan(principal.getId(), image);
    }

    @GetMapping
    public List<DiseaseScanResponse> history(@AuthenticationPrincipal UserPrincipal principal) {
        return diseaseScanService.getHistory(principal.getId());
    }

    @GetMapping("/{id}")
    public DiseaseScanResponse getOne(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id
    ) {
        return diseaseScanService.getById(id, principal.getId());
    }
}

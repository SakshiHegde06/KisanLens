package com.kisanlens.field;

import com.kisanlens.common.ApiResponse;
import com.kisanlens.user.UserPrincipal;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fields")
public class FieldController {

    private final FieldService fieldService;

    public FieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    @GetMapping
    public ApiResponse<List<Field>> myFields(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(fieldService.getForOwner(principal.getId()));
    }

    @PostMapping
    public ApiResponse<Field> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CreateFieldRequest request
    ) {
        Field field = fieldService.create(
                principal.getId(), request.name(), request.latitude(), request.longitude()
        );
        return ApiResponse.ok(field);
    }

    public record CreateFieldRequest(
            @NotBlank String name,
            double latitude,
            double longitude
    ) {
    }
}

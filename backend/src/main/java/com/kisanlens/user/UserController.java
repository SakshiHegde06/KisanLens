package com.kisanlens.user;

import com.kisanlens.common.ApiResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ApiResponse<UserProfileDto> me(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ApiResponse.ok(UserProfileDto.from(user));
    }

    public record UserProfileDto(String id, String name, String email, String preferredLanguage) {
        static UserProfileDto from(User user) {
            return new UserProfileDto(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getPreferredLanguage()
            );
        }
    }
}

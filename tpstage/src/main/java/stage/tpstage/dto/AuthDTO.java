package stage.tpstage.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

public class AuthDTO {


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class LoginRequest {
        @NotBlank(message = "Le nom d'utilisateur est obligatoire")
        private String username;

        @NotBlank(message = "Le mot de passe est obligatoire")
        private String password;
    }

    @Data
    public class SignupRequest {
        @NotBlank
        @Size(min = 3, max = 50)
        private String username;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6)
        private String password;

        @NotBlank
        private String fullName;

        private String phoneNumber;

        private Set<String> roles;
    }



}

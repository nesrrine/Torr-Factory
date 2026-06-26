package stage.tpstage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeCreateRequest {
    @NotNull
    private Long clientId;

    @NotNull
    private LocalDate dateLivraisonPrevue;

    @NotBlank
    private String adresseLivraison;

    @NotEmpty
    private List<LigneCommandeRequest> lignes;
}
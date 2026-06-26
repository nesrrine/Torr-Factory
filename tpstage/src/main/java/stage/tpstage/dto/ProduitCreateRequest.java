package stage.tpstage.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProduitCreateRequest {
    @NotBlank
    private String reference;

    @NotBlank
    private String nom;

    private String description;

    @NotNull
    private String typeCafe; // ARABICA, ROBUSTA, MELANGE

    private String niveauTorrefaction;

    @NotNull
    @Min(0)
    private Double prixKg;

    @NotNull
    @Min(0)
    private Double stockDisponibleKg;

    @Min(0)
    private Double stockMiniKg = 10.0;
}

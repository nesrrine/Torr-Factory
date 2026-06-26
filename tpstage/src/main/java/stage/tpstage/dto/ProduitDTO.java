package stage.tpstage.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProduitDTO {
    private Long id;
    private String reference;
    private String nom;
    private String description;
    private String typeCafe;
    private String niveauTorrefaction;
    private Double prixKg;
    private Double stockDisponibleKg;
    private Double stockMiniKg;
    private Boolean disponible;
    private Boolean stockFaible;
}

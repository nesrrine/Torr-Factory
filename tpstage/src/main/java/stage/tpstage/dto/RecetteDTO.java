package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data           // ✅ génère getters + setters
@NoArgsConstructor
@AllArgsConstructor
public class RecetteDTO {
    private Long id;
    private String nom;
    private String description;
    private Integer quantiteTotale;
    private Boolean actif;
    private String produitNom;
}
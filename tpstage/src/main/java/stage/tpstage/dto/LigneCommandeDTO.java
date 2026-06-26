package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeDTO {
    private Long id;
    private Long produitId;
    private String produitNom;
    private Double quantiteKg;
    private Double prixUnitaire;
    private Double sousTotal;
}



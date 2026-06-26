package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CommandeRecente {
    private String numeroCommande;
    private String clientNom;
    private String statut;
    private Double montant;
    private String dateCommande;
}

package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private Long id;
    private String numeroCommande;
    private Long clientId;
    private String clientNom;
    private LocalDate dateCommande;
    private LocalDate dateLivraisonPrevue;
    private String statut;
    private Double montantTotal;
    private String adresseLivraison;
    private List<LigneCommandeDTO> lignes;
}

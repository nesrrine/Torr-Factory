package stage.tpstage.entity;
import jakarta.persistence.*;
import lombok.*;

import lombok.Data;

@Entity
@Table(name = "lignes_commande")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;

    @ManyToOne
    @JoinColumn(name = "produit_id")
    private Produit produit;

    private Double quantiteKg;

    private Double prixUnitaire;

    private Double sousTotal;
}

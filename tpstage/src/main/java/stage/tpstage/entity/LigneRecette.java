package stage.tpstage.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lignes_recette")
@Data
@NoArgsConstructor
public class LigneRecette {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recette_id", nullable = false)
    private Recette recette;

    @ManyToOne
    @JoinColumn(name = "lot_id", nullable = false)
    private LotCafe lot;

    @Column(nullable = false)
    private Double pourcentage; // Pourcentage dans la recette

    @Column(nullable = false)
    private Double quantite; // Quantité en kg
}

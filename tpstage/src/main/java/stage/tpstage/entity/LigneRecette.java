package stage.tpstage.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonBackReference
    // ✅ côté enfant — ne sera PAS sérialisé (coupe la boucle)
    private Recette recette;

    @ManyToOne
    @JoinColumn(name = "lot_id", nullable = false)
    @JsonIgnoreProperties({"lignesRecette", "hibernateLazyInitializer", "handler"})
    // ✅ évite la boucle côté LotCafe aussi
    private LotCafe lot;

    @Column(nullable = false)
    private Double pourcentage;

    @Column(nullable = false)
    private Double quantite;
}
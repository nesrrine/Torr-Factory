package stage.tpstage.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "recettes")
@Data
@NoArgsConstructor
public class Recette {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer quantiteTotale;

    @Column(nullable = false)
    private Boolean actif = true;

    @ManyToOne
    @JoinColumn(name = "produit_id")
    @JsonIgnoreProperties({"recettes", "hibernateLazyInitializer", "handler"})
    // ✅ remplace @JsonIgnore — le produit sera visible mais sans boucle
    private Produit produit;

    @OneToMany(mappedBy = "recette")
    @JsonManagedReference
    // ✅ côté parent — sera sérialisé normalement
    private Set<LigneRecette> lignes = new HashSet<>();
}
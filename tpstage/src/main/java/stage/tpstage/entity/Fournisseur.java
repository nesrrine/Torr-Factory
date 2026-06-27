package stage.tpstage.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "fournisseurs")
@Data
@NoArgsConstructor
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String pays;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(nullable = false)
    private Integer delaiLivraison; // Délai moyen en jours

    @Column(nullable = false)
    private String notes;

    @OneToMany(mappedBy = "fournisseur")
    private Set<LotCafe> lots = new HashSet<>();
}

package stage.tpstage.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profils_torrefaction")
@Data
@NoArgsConstructor
public class ProfilTorréfaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer temperatureCharge; // Température de chargement en °C

    @Column(nullable = false)
    private Integer temperatureFin; // Température de fin en °C

    @Column(nullable = false)
    private Integer dureeTotale; // Durée totale en minutes

    @Column(nullable = false)
    private Integer temperaturePremierCrack; // Température du premier crack

    @Column(nullable = false)
    private Integer dureeDeveloppement; // Durée de développement en minutes

    @Column(nullable = false)
    private String typeCafe; // ARABICA, ROBUSTA, MELANGE

    @Column(nullable = false)
    private Integer niveauTorréfaction; // 1-10 (clair à très foncé)

    @Column(nullable = false)
    private Boolean actif = true;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User createdBy;

    public enum TypeCafe {
        ARABICA,
        ROBUSTA,
        MELANGE
    }
}

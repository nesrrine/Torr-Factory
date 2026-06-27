package stage.tpstage.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "controles_qualite")
@Data
@NoArgsConstructor
public class ControleQualite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lot_id", nullable = false)
    private LotCafe lot;

    @Column(nullable = false)
    private LocalDateTime dateControle;

    @Column(nullable = false)
    private Double humidite; // Pourcentage d'humidité

    @Column(nullable = false)
    private Double densite; // Densité en g/L

    @Column(nullable = false)
    private Integer pourcentageDefauts; // Pourcentage de défauts

    @Column(nullable = false)
    private Integer couleur; // Échelle de couleur 1-10

    @Column(nullable = false)
    private String noteDegustation; // Notes de dégustation

    @Column(nullable = false)
    private Boolean conforme; // Conforme aux normes

    @Column(nullable = false)
    private String observations;

    @ManyToOne
    @JoinColumn(name = "controleur_id")
    private User controleur;

    public enum ResultatControle {
        CONFORME,
        NON_CONFORME,
        A_RECONTROLLER
    }
}

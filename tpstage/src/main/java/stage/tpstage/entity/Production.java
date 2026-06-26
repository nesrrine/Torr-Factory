package stage.tpstage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "production")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Production {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lot_id", nullable = false)
    private LotCafe lotCafe;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    @ManyToOne
    @JoinColumn(name = "operateur_id")
    private User operateur;

    private LocalDate dateTorrefaction;

    private Integer temperatureCelsius;

    private Integer dureeMinutes;

    private Double quantiteTorrefieeKg;

    @Enumerated(EnumType.STRING)
    private StatutProduction statut = StatutProduction.PLANIFIEE;

    private String observations;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum StatutProduction {
        PLANIFIEE, EN_COURS, TERMINEE, ANNULEE
    }
}
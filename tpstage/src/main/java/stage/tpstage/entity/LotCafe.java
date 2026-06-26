package stage.tpstage.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lot_cafe")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LotCafe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le numéro de lot est obligatoire")
    @Column(unique = true, nullable = false)
    private String numeroLot;

    @NotNull(message = "Le type de café est obligatoire")
    @Enumerated(EnumType.STRING)
    private TypeCafe typeCafe;

    @NotNull(message = "L'origine est obligatoire")
    private String origine;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 0, message = "La quantité doit être positive")
    private Double quantiteKg;

    @NotNull
    private LocalDate dateReception;

    @NotBlank
    private String fournisseur;

    @Enumerated(EnumType.STRING)
    private StatutLot statut = StatutLot.EN_STOCK;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TypeCafe {
        ARABICA, ROBUSTA, MELANGE
    }

    public enum StatutLot {
        EN_STOCK, EN_PRODUCTION, TORREFIE, EXPIRE
    }
}
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
@Table(name = "machines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroSerie;

    private String nom;

    @Enumerated(EnumType.STRING)
    private TypeMachine type;

    private LocalDate dateMiseEnService;

    @Enumerated(EnumType.STRING)
    private StatutMachine statut = StatutMachine.OPERATIONNELLE;

    private LocalDate dateDerniereMaintenance;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TypeMachine {
        TORREFACTEUR, BROYEUR, EMBALLEUSE
    }

    public enum StatutMachine {
        OPERATIONNELLE, EN_MAINTENANCE, HORS_SERVICE
    }
}

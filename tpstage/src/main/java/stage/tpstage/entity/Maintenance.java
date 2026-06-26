package stage.tpstage.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private User technicien;

    private LocalDate dateIntervention;

    @Enumerated(EnumType.STRING)
    private TypeMaintenance type;

    private String description;

    private Double coutEuros;

    @Enumerated(EnumType.STRING)
    private StatutMaintenance statut = StatutMaintenance.PLANIFIEE;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TypeMaintenance {
        PREVENTIVE, CORRECTIVE, URGENTE
    }

    public enum StatutMaintenance {
        PLANIFIEE, EN_COURS, TERMINEE, REPORTEE
    }
}

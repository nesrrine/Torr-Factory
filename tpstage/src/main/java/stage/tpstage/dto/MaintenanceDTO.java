package stage.tpstage.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceDTO {
    private Long id;
    private Long machineId;
    private String machineNom;
    private Long technicienId;
    private String technicienNom;
    private LocalDate dateIntervention;
    private String type;
    private String description;
    private Double coutEuros;
    private String statut;
}

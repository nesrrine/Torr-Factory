package stage.tpstage.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceCreateRequest {
    @NotNull
    private Long machineId;

    private Long technicienId;

    @NotNull
    private LocalDate dateIntervention;

    @NotNull
    private String type; // PREVENTIVE, CORRECTIVE, URGENTE

    @NotBlank
    private String description;

    @Min(0)
    private Double coutEuros;
}

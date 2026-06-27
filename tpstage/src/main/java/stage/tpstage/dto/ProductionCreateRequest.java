package stage.tpstage.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionCreateRequest {
    @NotNull
    private Long lotCafeId;

    @NotNull
    private Long machineId;

    private Long operateurId;

    @NotNull
    private LocalDate dateTorrefaction;

    private Integer temperatureCelsius;

    private Integer dureeMinutes;

    @NotNull
    @Min(0)
    private Double quantiteTorrefieeKg;

    private String observations;
}
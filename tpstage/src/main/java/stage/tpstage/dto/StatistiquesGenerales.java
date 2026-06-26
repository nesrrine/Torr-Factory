package stage.tpstage.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
@Data
@AllArgsConstructor
public class StatistiquesGenerales {
    private Long nombreLots;
    private Long nombreProductions;
    private Long nombreCommandes;
    private Long nombreMachines;
    private Double stockTotalKg;
    private Double chiffreAffaireMois;
    private Integer nombreCommandesEnCours;
    private Integer machinesEnPanne;
}

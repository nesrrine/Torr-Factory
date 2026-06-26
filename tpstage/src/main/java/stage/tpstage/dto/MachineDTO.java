package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MachineDTO {
    private Long id;
    private String numeroSerie;
    private String nom;
    private String type;
    private LocalDate dateMiseEnService;
    private String statut;
    private LocalDate dateDerniereMaintenance;
    private Integer joursDepuisMaintenance;
}

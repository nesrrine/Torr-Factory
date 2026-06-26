package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor
@AllArgsConstructor
public class MachineStatut {
    private String machineNom;
    private String statut;
    private Integer joursDepuisMaintenance;
}

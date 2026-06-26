package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {
    private StatistiquesGenerales statistiques;
    private List<ProductionMensuelle> productionMensuelle;
    private List<StockProduit> stocksFaibles;
    private List<MachineStatut> statutsMachines;
    private List<CommandeRecente> commandesRecentes;


}

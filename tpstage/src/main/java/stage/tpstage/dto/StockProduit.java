package stage.tpstage.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockProduit {
    private String produitNom;
    private Double stockActuel;
    private Double stockMini;
    private Double pourcentage;
}

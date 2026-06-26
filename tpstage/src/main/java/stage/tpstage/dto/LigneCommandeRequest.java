package stage.tpstage.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeRequest {
    @NotNull
    private Long produitId;

    @NotNull
    @Min(0)
    private Double quantiteKg;
}

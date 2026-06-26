package stage.tpstage.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionDTO {
    private Long id;
    private Long lotCafeId;
    private String numeroLot;
    private Long machineId;
    private String machineNom;
    private Long operateurId;
    private String operateurNom;
    private LocalDate dateTorrefaction;
    private Integer temperatureCelsius;
    private Integer dureeMinutes;
    private Double quantiteTorrefieeKg;
    private String statut;
    private String observations;
}
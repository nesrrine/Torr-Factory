package stage.tpstage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControleQualiteDTO {

    private Long lotId;

    private LocalDateTime dateControle;

    private Double humidite;

    private Double densite;

    private Integer pourcentageDefauts;

    private Integer couleur;

    private String noteDegustation;

    private Boolean conforme;

    private String observations;
}
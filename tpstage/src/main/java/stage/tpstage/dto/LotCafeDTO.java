package stage.tpstage.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import stage.tpstage.entity.LotCafe;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LotCafeDTO {

    private Long id;

    @NotBlank(message = "Le numéro de lot est obligatoire")
    private String numeroLot;

    @NotNull(message = "Le type de café est obligatoire")
    private LotCafe.TypeCafe typeCafe;

    @NotNull(message = "L'origine est obligatoire")
    private String origine;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 0, message = "La quantité doit être positive")
    private Double quantiteKg;

    @NotNull(message = "La date de réception est obligatoire")
    private LocalDate dateReception;

    @NotBlank(message = "Le fournisseur est obligatoire")
    private String fournisseur;

    private LotCafe.StatutLot statut;

    private LocalDateTime createdAt;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroLot() { return numeroLot; }
    public void setNumeroLot(String numeroLot) { this.numeroLot = numeroLot; }
    public LotCafe.TypeCafe getTypeCafe() { return typeCafe; }
    public void setTypeCafe(LotCafe.TypeCafe typeCafe) { this.typeCafe = typeCafe; }
    public String getOrigine() { return origine; }
    public void setOrigine(String origine) { this.origine = origine; }
    public Double getQuantiteKg() { return quantiteKg; }
    public void setQuantiteKg(Double quantiteKg) { this.quantiteKg = quantiteKg; }
    public LocalDate getDateReception() { return dateReception; }
    public void setDateReception(LocalDate dateReception) { this.dateReception = dateReception; }
    public String getFournisseur() { return fournisseur; }
    public void setFournisseur(String fournisseur) { this.fournisseur = fournisseur; }
    public LotCafe.StatutLot getStatut() { return statut; }
    public void setStatut(LotCafe.StatutLot statut) { this.statut = statut; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


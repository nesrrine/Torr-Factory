package stage.tpstage.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "produits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String reference;

    private String nom;

    private String description;

    @Enumerated(EnumType.STRING)
    private LotCafe.TypeCafe typeCafe;

    private String niveauTorrefaction;

    private Double prixKg;

    private Double stockDisponibleKg;

    private Double stockMiniKg = 10.0;

    private Boolean disponible = true;

    private LocalDateTime createdAt = LocalDateTime.now();
}
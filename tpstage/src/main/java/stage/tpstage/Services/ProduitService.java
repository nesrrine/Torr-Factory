package stage.tpstage.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.dto.*;
import stage.tpstage.entity.*;
import stage.tpstage.repository.ProduitRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProduitService {
    @Autowired
    private ProduitRepository produitRepository;

    public List<ProduitDTO> getAllProduits() {
        return produitRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProduitDTO getProduitById(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        return convertToDTO(produit);
    }

    public ProduitDTO createProduit(ProduitCreateRequest request) {
        if (produitRepository.findByReference(request.getReference()).isPresent()) {
            throw new RuntimeException("Un produit avec cette référence existe déjà");
        }

        Produit produit = new Produit();
        produit.setReference(request.getReference());
        produit.setNom(request.getNom());
        produit.setDescription(request.getDescription());
        produit.setTypeCafe(LotCafe.TypeCafe.valueOf(request.getTypeCafe()));
        produit.setNiveauTorrefaction(request.getNiveauTorrefaction());
        produit.setPrixKg(request.getPrixKg());
        produit.setStockDisponibleKg(request.getStockDisponibleKg());
        produit.setStockMiniKg(request.getStockMiniKg());
        produit.setDisponible(true);

        Produit saved = produitRepository.save(produit);
        return convertToDTO(saved);
    }

    public ProduitDTO updateProduit(Long id, ProduitCreateRequest request) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        produit.setNom(request.getNom());
        produit.setDescription(request.getDescription());
        produit.setTypeCafe(LotCafe.TypeCafe.valueOf(request.getTypeCafe()));
        produit.setNiveauTorrefaction(request.getNiveauTorrefaction());
        produit.setPrixKg(request.getPrixKg());
        produit.setStockMiniKg(request.getStockMiniKg());

        Produit saved = produitRepository.save(produit);
        return convertToDTO(saved);
    }

    public ProduitDTO updateStock(Long id, Double quantite) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        produit.setStockDisponibleKg(produit.getStockDisponibleKg() + quantite);

        if (produit.getStockDisponibleKg() <= 0) {
            produit.setDisponible(false);
        } else {
            produit.setDisponible(true);
        }

        Produit saved = produitRepository.save(produit);
        return convertToDTO(saved);
    }

    public List<ProduitDTO> getProduitsStockFaible() {
        return produitRepository.findAll().stream()
                .filter(p -> p.getStockDisponibleKg() < p.getStockMiniKg())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProduitDTO convertToDTO(Produit produit) {
        ProduitDTO dto = new ProduitDTO();
        dto.setId(produit.getId());
        dto.setReference(produit.getReference());
        dto.setNom(produit.getNom());
        dto.setDescription(produit.getDescription());
        dto.setTypeCafe(produit.getTypeCafe().name());
        dto.setNiveauTorrefaction(produit.getNiveauTorrefaction());
        dto.setPrixKg(produit.getPrixKg());
        dto.setStockDisponibleKg(produit.getStockDisponibleKg());
        dto.setStockMiniKg(produit.getStockMiniKg());
        dto.setDisponible(produit.getDisponible());
        dto.setStockFaible(produit.getStockDisponibleKg() < produit.getStockMiniKg());
        return dto;
    }
}

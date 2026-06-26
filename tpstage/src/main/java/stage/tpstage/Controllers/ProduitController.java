package stage.tpstage.Controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.ProduitService;
import stage.tpstage.dto.ProduitCreateRequest;
import stage.tpstage.dto.ProduitDTO;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
public class ProduitController {
    @Autowired
    private ProduitService produitService;

    @GetMapping
    public ResponseEntity<List<ProduitDTO>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDTO> getProduitById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.getProduitById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<ProduitDTO> createProduit(@Valid @RequestBody ProduitCreateRequest request) {
        return ResponseEntity.ok(produitService.createProduit(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<ProduitDTO> updateProduit(
            @PathVariable Long id,
            @Valid @RequestBody ProduitCreateRequest request) {
        return ResponseEntity.ok(produitService.updateProduit(id, request));
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<ProduitDTO> updateStock(
            @PathVariable Long id,
            @RequestParam Double quantite) {
        return ResponseEntity.ok(produitService.updateStock(id, quantite));
    }

    @GetMapping("/stock-faible")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<List<ProduitDTO>> getProduitsStockFaible() {
        return ResponseEntity.ok(produitService.getProduitsStockFaible());
    }
}

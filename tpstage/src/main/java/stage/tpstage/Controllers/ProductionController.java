package stage.tpstage.Controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.ProductionService;
import stage.tpstage.dto.ProductionCreateRequest;
import stage.tpstage.dto.ProductionDTO;
import stage.tpstage.entity.Production;

import java.util.List;

@RestController
@RequestMapping("/api/productions")
@CrossOrigin(origins = "*")
public class ProductionController {
    @Autowired
    private ProductionService productionService;

    @GetMapping
    public ResponseEntity<List<ProductionDTO>> getAllProductions() {
        return ResponseEntity.ok(productionService.getAllProductions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductionDTO> getProductionById(@PathVariable Long id) {
        return ResponseEntity.ok(productionService.getProductionById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<ProductionDTO> createProduction(@Valid @RequestBody ProductionCreateRequest request) {
        return ResponseEntity.ok(productionService.createProduction(request));
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER', 'WORKER')")
    public ResponseEntity<ProductionDTO> updateStatut(
            @PathVariable Long id,
            @RequestParam Production.StatutProduction statut) {
        return ResponseEntity.ok(productionService.updateStatut(id, statut));
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<List<ProductionDTO>> getProductionsByStatut(
            @PathVariable Production.StatutProduction statut) {
        return ResponseEntity.ok(productionService.getProductionsByStatut(statut));
    }
}

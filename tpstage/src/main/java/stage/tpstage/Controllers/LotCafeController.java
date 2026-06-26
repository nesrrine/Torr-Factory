package stage.tpstage.Controllers;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.LotCafeService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.LotCafeService;
import stage.tpstage.dto.LotCafeDTO;
import stage.tpstage.entity.LotCafe;

import java.util.List;

@RestController
@RequestMapping("/api/lots")
@CrossOrigin(origins = "*")
public class LotCafeController {

    @Autowired
    private LotCafeService lotCafeService;

    @GetMapping
    public ResponseEntity<List<LotCafeDTO>> getAllLots() {
        return ResponseEntity.ok(lotCafeService.getAllLots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LotCafeDTO> getLotById(@PathVariable Long id) {
        return ResponseEntity.ok(lotCafeService.getLotById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCTION_MANAGER')")
    public ResponseEntity<LotCafeDTO> createLot(@Valid @RequestBody LotCafeDTO dto) {
        return ResponseEntity.ok(lotCafeService.createLot(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCTION_MANAGER')")
    public ResponseEntity<LotCafeDTO> updateLot(@PathVariable Long id, @Valid @RequestBody LotCafeDTO dto) {
        return ResponseEntity.ok(lotCafeService.updateLot(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCTION_MANAGER')")
    public ResponseEntity<Void> deleteLot(@PathVariable Long id) {
        lotCafeService.deleteLot(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<LotCafeDTO>> getLotsByStatut(@PathVariable LotCafe.StatutLot statut) {
        return ResponseEntity.ok(lotCafeService.getLotsByStatut(statut));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<LotCafeDTO>> getLotsByType(@PathVariable LotCafe.TypeCafe type) {
        return ResponseEntity.ok(lotCafeService.getLotsByType(type));
    }
}

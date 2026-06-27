package stage.tpstage.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.ControleQualiteService;
import stage.tpstage.entity.ControleQualite;

import java.util.List;

@RestController
@RequestMapping("/api/controles-qualite")
@CrossOrigin(origins = "*")
public class ControleQualiteController {

    @Autowired
    private ControleQualiteService controleService;

    @GetMapping
    public ResponseEntity<List<ControleQualite>> getAllControles() {
        return ResponseEntity.ok(controleService.getAllControles());
    }

    @GetMapping("/lot/{lotId}")
    public ResponseEntity<List<ControleQualite>> getControlesByLot(@PathVariable Long lotId) {
        return ResponseEntity.ok(controleService.getControlesByLot(lotId));
    }

    @GetMapping("/non-conformes")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<List<ControleQualite>> getControlesNonConformes() {
        return ResponseEntity.ok(controleService.getControlesNonConformes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ControleQualite> getControleById(@PathVariable Long id) {
        return ResponseEntity.ok(controleService.getControleById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER', 'WORKER')")
    public ResponseEntity<ControleQualite> createControle(@RequestBody ControleQualite controle) {
        return ResponseEntity.ok(controleService.createControle(controle));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER', 'WORKER')")
    public ResponseEntity<ControleQualite> updateControle(@PathVariable Long id, @RequestBody ControleQualite controle) {
        return ResponseEntity.ok(controleService.updateControle(id, controle));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteControle(@PathVariable Long id) {
        controleService.deleteControle(id);
        return ResponseEntity.noContent().build();
    }
}

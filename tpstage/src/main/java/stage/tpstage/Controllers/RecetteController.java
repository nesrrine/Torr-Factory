package stage.tpstage.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.RecetteService;
import stage.tpstage.entity.LigneRecette;
import stage.tpstage.entity.Recette;

import java.util.List;

@RestController
@RequestMapping("/api/recettes")
@CrossOrigin(origins = "*")
public class RecetteController {

    @Autowired
    private RecetteService recetteService;

    @GetMapping
    public ResponseEntity<List<Recette>> getAllRecettes() {
        return ResponseEntity.ok(recetteService.getAllRecettes());
    }

    @GetMapping("/actives")
    public ResponseEntity<List<Recette>> getRecettesActives() {
        return ResponseEntity.ok(recetteService.getRecettesActives());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recette> getRecetteById(@PathVariable Long id) {
        return ResponseEntity.ok(recetteService.getRecetteById(id));
    }

    @GetMapping("/{id}/lignes")
    public ResponseEntity<List<LigneRecette>> getLignesByRecette(@PathVariable Long id) {
        return ResponseEntity.ok(recetteService.getLignesByRecette(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<Recette> createRecette(@RequestBody Recette recette) {
        return ResponseEntity.ok(recetteService.createRecette(recette));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<Recette> updateRecette(@PathVariable Long id, @RequestBody Recette recette) {
        return ResponseEntity.ok(recetteService.updateRecette(id, recette));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRecette(@PathVariable Long id) {
        recetteService.deleteRecette(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/lignes")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<LigneRecette> addLigneRecette(@PathVariable Long id, @RequestBody LigneRecette ligne) {
        return ResponseEntity.ok(recetteService.addLigneRecette(ligne));
    }

    @DeleteMapping("/lignes/{ligneId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLigneRecette(@PathVariable Long ligneId) {
        recetteService.deleteLigneRecette(ligneId);
        return ResponseEntity.noContent().build();
    }
}

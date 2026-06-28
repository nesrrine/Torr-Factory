package stage.tpstage.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.RecetteService;
import stage.tpstage.dto.RecetteDTO;
import stage.tpstage.entity.LigneRecette;
import stage.tpstage.entity.Recette;

import java.util.List;

@RestController
@RequestMapping("/api/recettes")
@CrossOrigin(origins = "*")
public class RecetteController {

    @Autowired
    private RecetteService recetteService;

    // ✅ retourne des DTOs au lieu des entités → plus de boucle JSON
    @GetMapping
    public ResponseEntity<List<RecetteDTO>> getAllRecettes() {
        return ResponseEntity.ok(recetteService.getAllRecettesDTO());
    }

    @GetMapping("/actives")
    public ResponseEntity<List<RecetteDTO>> getRecettesActives() {
        return ResponseEntity.ok(recetteService.getRecettesActivesDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecetteDTO> getRecetteById(@PathVariable Long id) {
        return ResponseEntity.ok(recetteService.getRecetteDTOById(id));
    }

    @GetMapping("/{id}/lignes")
    public ResponseEntity<List<LigneRecette>> getLignesByRecette(@PathVariable Long id) {
        return ResponseEntity.ok(recetteService.getLignesByRecette(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<RecetteDTO> createRecette(@RequestBody RecetteDTO dto) {
        return ResponseEntity.ok(recetteService.createRecetteFromDTO(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<RecetteDTO> updateRecette(@PathVariable Long id, @RequestBody RecetteDTO dto) {
        return ResponseEntity.ok(recetteService.updateRecetteFromDTO(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRecette(@PathVariable Long id) {
        recetteService.deleteRecette(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/lignes")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<LigneRecette> addLigneRecette(
            @PathVariable Long id,
            @RequestBody LigneRecette ligne) {
        return ResponseEntity.ok(recetteService.addLigneRecette(id, ligne));
    }

    @DeleteMapping("/lignes/{ligneId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLigneRecette(@PathVariable Long ligneId) {
        recetteService.deleteLigneRecette(ligneId);
        return ResponseEntity.noContent().build();
    }
}
package stage.tpstage.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.ProfilTorréfactionService;
import stage.tpstage.entity.ProfilTorréfaction;

import java.util.List;

@RestController
@RequestMapping("/api/profils-torrefaction")
@CrossOrigin(origins = "*")
public class ProfilTorréfactionController {

    @Autowired
    private ProfilTorréfactionService profilService;

    @GetMapping
    public ResponseEntity<List<ProfilTorréfaction>> getAllProfils() {
        return ResponseEntity.ok(profilService.getAllProfils());
    }

    @GetMapping("/actifs")
    public ResponseEntity<List<ProfilTorréfaction>> getProfilsActifs() {
        return ResponseEntity.ok(profilService.getProfilsActifs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfilTorréfaction> getProfilById(@PathVariable Long id) {
        return ResponseEntity.ok(profilService.getProfilById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<ProfilTorréfaction> createProfil(@RequestBody ProfilTorréfaction profil) {
        return ResponseEntity.ok(profilService.createProfil(profil));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCTION_MANAGER')")
    public ResponseEntity<ProfilTorréfaction> updateProfil(@PathVariable Long id, @RequestBody ProfilTorréfaction profil) {
        return ResponseEntity.ok(profilService.updateProfil(id, profil));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProfil(@PathVariable Long id) {
        profilService.deleteProfil(id);
        return ResponseEntity.noContent().build();
    }
}

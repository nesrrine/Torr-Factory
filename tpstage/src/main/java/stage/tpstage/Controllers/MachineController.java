package stage.tpstage.Controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.MachineService;
import stage.tpstage.dto.MachineCreateRequest;
import stage.tpstage.dto.MachineDTO;
import stage.tpstage.entity.Machine;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "*")
public class MachineController {
    @Autowired
    private MachineService machineService;

    @GetMapping
    public ResponseEntity<List<MachineDTO>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineDTO> getMachineById(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.getMachineById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MachineDTO> createMachine(@Valid @RequestBody MachineCreateRequest request) {
        return ResponseEntity.ok(machineService.createMachine(request));
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAINTENANCE')")
    public ResponseEntity<MachineDTO> updateStatut(
            @PathVariable Long id,
            @RequestParam Machine.StatutMachine statut) {
        return ResponseEntity.ok(machineService.updateStatut(id, statut));
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAINTENANCE')")
    public ResponseEntity<List<MachineDTO>> getMachinesByStatut(
            @PathVariable Machine.StatutMachine statut) {
        return ResponseEntity.ok(machineService.getMachinesByStatut(statut));
    }
}

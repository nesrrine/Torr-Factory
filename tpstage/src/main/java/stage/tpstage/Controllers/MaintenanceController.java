package stage.tpstage.Controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import stage.tpstage.Services.MaintenanceService;
import stage.tpstage.dto.MaintenanceCreateRequest;
import stage.tpstage.dto.MaintenanceDTO;
import stage.tpstage.entity.Maintenance;

import java.util.List;

@RestController
@RequestMapping("/api/maintenances")
@CrossOrigin(origins = "*")
public class MaintenanceController {
    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceDTO>> getAllMaintenances() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenances());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDTO> getMaintenanceById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAINTENANCE')")
    public ResponseEntity<MaintenanceDTO> createMaintenance(@Valid @RequestBody MaintenanceCreateRequest request) {
        return ResponseEntity.ok(maintenanceService.createMaintenance(request));
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAINTENANCE')")
    public ResponseEntity<MaintenanceDTO> updateStatut(
            @PathVariable Long id,
            @RequestParam Maintenance.StatutMaintenance statut) {
        return ResponseEntity.ok(maintenanceService.updateStatut(id, statut));
    }

    @GetMapping("/machine/{machineId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAINTENANCE')")
    public ResponseEntity<List<MaintenanceDTO>> getMaintenancesByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(maintenanceService.getMaintenancesByMachine(machineId));
    }
}

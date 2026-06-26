package stage.tpstage.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stage.tpstage.dto.*;
import stage.tpstage.entity.*;
import stage.tpstage.repository.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {
    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private UserRepository userRepository;

    public List<MaintenanceDTO> getAllMaintenances() {
        return maintenanceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MaintenanceDTO getMaintenanceById(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance non trouvée"));
        return convertToDTO(maintenance);
    }

    @Transactional
    public MaintenanceDTO createMaintenance(MaintenanceCreateRequest request) {
        Machine machine = machineRepository.findById(request.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine non trouvée"));

        Maintenance maintenance = new Maintenance();
        maintenance.setMachine(machine);

        if (request.getTechnicienId() != null) {
            User technicien = userRepository.findById(request.getTechnicienId())
                    .orElseThrow(() -> new RuntimeException("Technicien non trouvé"));
            maintenance.setTechnicien(technicien);
        }

        maintenance.setDateIntervention(request.getDateIntervention());
        maintenance.setType(Maintenance.TypeMaintenance.valueOf(request.getType()));
        maintenance.setDescription(request.getDescription());
        maintenance.setCoutEuros(request.getCoutEuros());
        maintenance.setStatut(Maintenance.StatutMaintenance.PLANIFIEE);

        // Mise à jour du statut de la machine
        if (request.getType().equals("URGENTE") || request.getType().equals("CORRECTIVE")) {
            machine.setStatut(Machine.StatutMachine.EN_MAINTENANCE);
            machineRepository.save(machine);
        }

        Maintenance saved = maintenanceRepository.save(maintenance);
        return convertToDTO(saved);
    }

    @Transactional
    public MaintenanceDTO updateStatut(Long id, Maintenance.StatutMaintenance statut) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance non trouvée"));

        maintenance.setStatut(statut);

        if (statut == Maintenance.StatutMaintenance.TERMINEE) {
            Machine machine = maintenance.getMachine();
            machine.setStatut(Machine.StatutMachine.OPERATIONNELLE);
            machine.setDateDerniereMaintenance(maintenance.getDateIntervention());
            machineRepository.save(machine);
        }

        Maintenance saved = maintenanceRepository.save(maintenance);
        return convertToDTO(saved);
    }

    public List<MaintenanceDTO> getMaintenancesByMachine(Long machineId) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new RuntimeException("Machine non trouvée"));
        return maintenanceRepository.findByMachine(machine).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MaintenanceDTO convertToDTO(Maintenance maintenance) {
        MaintenanceDTO dto = new MaintenanceDTO();
        dto.setId(maintenance.getId());
        dto.setMachineId(maintenance.getMachine().getId());
        dto.setMachineNom(maintenance.getMachine().getNom());

        if (maintenance.getTechnicien() != null) {
            dto.setTechnicienId(maintenance.getTechnicien().getId());
            dto.setTechnicienNom(maintenance.getTechnicien().getFullName());
        }

        dto.setDateIntervention(maintenance.getDateIntervention());
        dto.setType(maintenance.getType().name());
        dto.setDescription(maintenance.getDescription());
        dto.setCoutEuros(maintenance.getCoutEuros());
        dto.setStatut(maintenance.getStatut().name());
        return dto;
    }
}
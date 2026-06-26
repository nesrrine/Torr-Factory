package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.dto.*;
import stage.tpstage.entity.Machine;
import stage.tpstage.repository.MachineRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MachineService {
    @Autowired
    private MachineRepository machineRepository;

    public List<MachineDTO> getAllMachines() {
        return machineRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MachineDTO getMachineById(Long id) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine non trouvée"));
        return convertToDTO(machine);
    }

    public MachineDTO createMachine(MachineCreateRequest request) {
        if (machineRepository.findByNumeroSerie(request.getNumeroSerie()).isPresent()) {
            throw new RuntimeException("Une machine avec ce numéro de série existe déjà");
        }

        Machine machine = new Machine();
        machine.setNumeroSerie(request.getNumeroSerie());
        machine.setNom(request.getNom());
        machine.setType(Machine.TypeMachine.valueOf(request.getType()));
        machine.setDateMiseEnService(request.getDateMiseEnService());
        machine.setStatut(Machine.StatutMachine.OPERATIONNELLE);

        Machine saved = machineRepository.save(machine);
        return convertToDTO(saved);
    }

    public MachineDTO updateStatut(Long id, Machine.StatutMachine statut) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine non trouvée"));
        machine.setStatut(statut);
        Machine saved = machineRepository.save(machine);
        return convertToDTO(saved);
    }

    public List<MachineDTO> getMachinesByStatut(Machine.StatutMachine statut) {
        return machineRepository.findByStatut(statut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MachineDTO convertToDTO(Machine machine) {
        MachineDTO dto = new MachineDTO();
        dto.setId(machine.getId());
        dto.setNumeroSerie(machine.getNumeroSerie());
        dto.setNom(machine.getNom());
        dto.setType(machine.getType().name());
        dto.setDateMiseEnService(machine.getDateMiseEnService());
        dto.setStatut(machine.getStatut().name());
        dto.setDateDerniereMaintenance(machine.getDateDerniereMaintenance());

        if (machine.getDateDerniereMaintenance() != null) {
            long jours = ChronoUnit.DAYS.between(machine.getDateDerniereMaintenance(), LocalDate.now());
            dto.setJoursDepuisMaintenance((int) jours);
        }

        return dto;
    }
}
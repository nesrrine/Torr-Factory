package stage.tpstage.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stage.tpstage.dto.*;
import stage.tpstage.entity.*;
import stage.tpstage.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductionService {
    @Autowired
    private ProductionRepository productionRepository;

    @Autowired
    private LotCafeRepository lotCafeRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProductionDTO> getAllProductions() {
        return productionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductionDTO getProductionById(Long id) {
        Production production = productionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production non trouvée"));
        return convertToDTO(production);
    }

    @Transactional
    public ProductionDTO createProduction(ProductionCreateRequest request) {
        LotCafe lot = lotCafeRepository.findById(request.getLotCafeId())
                .orElseThrow(() -> new RuntimeException("Lot non trouvé"));

        Machine machine = machineRepository.findById(request.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine non trouvée"));

        if (!machine.getStatut().equals(Machine.StatutMachine.OPERATIONNELLE)) {
            throw new RuntimeException("La machine n'est pas opérationnelle");
        }

        if (request.getQuantiteTorrefieeKg() > lot.getQuantiteKg()) {
            throw new RuntimeException("Quantité demandée supérieure au stock disponible");
        }

        Production production = new Production();
        production.setLotCafe(lot);
        production.setMachine(machine);

        if (request.getOperateurId() != null) {
            User operateur = userRepository.findById(request.getOperateurId())
                    .orElseThrow(() -> new RuntimeException("Opérateur non trouvé"));
            production.setOperateur(operateur);
        }

        production.setDateTorrefaction(request.getDateTorrefaction());
        production.setTemperatureCelsius(request.getTemperatureCelsius());
        production.setDureeMinutes(request.getDureeMinutes());
        production.setQuantiteTorrefieeKg(request.getQuantiteTorrefieeKg());
        production.setObservations(request.getObservations());
        production.setStatut(Production.StatutProduction.PLANIFIEE);

        // Mise à jour du stock du lot
        lot.setQuantiteKg(lot.getQuantiteKg() - request.getQuantiteTorrefieeKg());
        lot.setStatut(LotCafe.StatutLot.EN_PRODUCTION);
        lotCafeRepository.save(lot);

        Production saved = productionRepository.save(production);
        return convertToDTO(saved);
    }

    @Transactional
    public ProductionDTO updateStatut(Long id, Production.StatutProduction statut) {
        Production production = productionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production non trouvée"));

        production.setStatut(statut);

        if (statut == Production.StatutProduction.TERMINEE) {
            LotCafe lot = production.getLotCafe();
            if (lot.getQuantiteKg() == 0) {
                lot.setStatut(LotCafe.StatutLot.TORREFIE);
                lotCafeRepository.save(lot);
            }
        }

        Production saved = productionRepository.save(production);
        return convertToDTO(saved);
    }

    public List<ProductionDTO> getProductionsByStatut(Production.StatutProduction statut) {
        return productionRepository.findByStatut(statut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductionDTO convertToDTO(Production production) {
        ProductionDTO dto = new ProductionDTO();
        dto.setId(production.getId());
        dto.setLotCafeId(production.getLotCafe().getId());
        dto.setNumeroLot(production.getLotCafe().getNumeroLot());
        dto.setMachineId(production.getMachine().getId());
        dto.setMachineNom(production.getMachine().getNom());

        if (production.getOperateur() != null) {
            dto.setOperateurId(production.getOperateur().getId());
            dto.setOperateurNom(production.getOperateur().getFullName());
        }

        dto.setDateTorrefaction(production.getDateTorrefaction());
        dto.setTemperatureCelsius(production.getTemperatureCelsius());
        dto.setDureeMinutes(production.getDureeMinutes());
        dto.setQuantiteTorrefieeKg(production.getQuantiteTorrefieeKg());
        dto.setStatut(production.getStatut().name());
        dto.setObservations(production.getObservations());
        return dto;
    }
}
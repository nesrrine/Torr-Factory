package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.dto.LotCafeDTO;
import stage.tpstage.entity.LotCafe;
import stage.tpstage.repository.LotCafeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LotCafeService {

    @Autowired
    private LotCafeRepository lotCafeRepository;

    // Mapper Entity <-> DTO
    private LotCafeDTO toDTO(LotCafe lot) {
        LotCafeDTO dto = new LotCafeDTO();
        dto.setId(lot.getId());
        dto.setNumeroLot(lot.getNumeroLot());
        dto.setTypeCafe(lot.getTypeCafe());
        dto.setOrigine(lot.getOrigine());
        dto.setQuantiteKg(lot.getQuantiteKg());
        dto.setDateReception(lot.getDateReception());
        dto.setFournisseur(lot.getFournisseur());
        dto.setStatut(lot.getStatut());
        dto.setCreatedAt(lot.getCreatedAt());
        return dto;
    }

    private LotCafe toEntity(LotCafeDTO dto) {
        LotCafe lot = new LotCafe();
        lot.setNumeroLot(dto.getNumeroLot());
        lot.setTypeCafe(dto.getTypeCafe());
        lot.setOrigine(dto.getOrigine());
        lot.setQuantiteKg(dto.getQuantiteKg());
        lot.setDateReception(dto.getDateReception());
        lot.setFournisseur(dto.getFournisseur());
        lot.setStatut(dto.getStatut() != null ? dto.getStatut() : LotCafe.StatutLot.EN_STOCK);
        return lot;
    }

    // CRUD et recherches
    public List<LotCafeDTO> getAllLots() {
        return lotCafeRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public LotCafeDTO getLotById(Long id) {
        return lotCafeRepository.findById(id).map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Lot non trouvé avec id " + id));
    }

    public LotCafeDTO createLot(LotCafeDTO dto) {
        LotCafe lot = toEntity(dto);
        return toDTO(lotCafeRepository.save(lot));
    }

    public LotCafeDTO updateLot(Long id, LotCafeDTO dto) {
        return lotCafeRepository.findById(id).map(lot -> {
            lot.setNumeroLot(dto.getNumeroLot());
            lot.setTypeCafe(dto.getTypeCafe());
            lot.setOrigine(dto.getOrigine());
            lot.setQuantiteKg(dto.getQuantiteKg());
            lot.setDateReception(dto.getDateReception());
            lot.setFournisseur(dto.getFournisseur());
            lot.setStatut(dto.getStatut());
            return toDTO(lotCafeRepository.save(lot));
        }).orElseThrow(() -> new RuntimeException("Lot non trouvé avec id " + id));
    }

    public void deleteLot(Long id) {
        lotCafeRepository.deleteById(id);
    }

    public List<LotCafeDTO> getLotsByStatut(LotCafe.StatutLot statut) {
        return lotCafeRepository.findByStatut(statut).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LotCafeDTO> getLotsByType(LotCafe.TypeCafe typeCafe) {
        return lotCafeRepository.findByTypeCafe(typeCafe).stream().map(this::toDTO).collect(Collectors.toList());
    }
}

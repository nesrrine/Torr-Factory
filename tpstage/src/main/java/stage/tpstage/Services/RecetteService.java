package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.dto.RecetteDTO;
import stage.tpstage.entity.LigneRecette;
import stage.tpstage.entity.Produit;
import stage.tpstage.entity.Recette;
import stage.tpstage.repository.LigneRecetteRepository;
import stage.tpstage.repository.ProduitRepository;
import stage.tpstage.repository.RecetteRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecetteService {

    @Autowired
    private RecetteRepository recetteRepository;

    @Autowired
    private LigneRecetteRepository ligneRecetteRepository;

    @Autowired
    private ProduitRepository produitRepository;

    // ✅ convertit Recette → RecetteDTO (plus de boucle JSON)
    private RecetteDTO toDTO(Recette r) {
        RecetteDTO dto = new RecetteDTO();
        dto.setId(r.getId());
        dto.setNom(r.getNom());
        dto.setDescription(r.getDescription());
        dto.setQuantiteTotale(r.getQuantiteTotale());
        dto.setActif(r.getActif());
        dto.setProduitNom(r.getProduit() != null ? r.getProduit().getNom() : null);
        return dto;
    }

    public List<RecetteDTO> getAllRecettesDTO() {
        return recetteRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<RecetteDTO> getRecettesActivesDTO() {
        return recetteRepository.findByActifTrue()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public RecetteDTO getRecetteDTOById(Long id) {
        Recette r = recetteRepository.findById(id).orElse(null);
        return r != null ? toDTO(r) : null;
    }

    // ✅ create depuis DTO
    public RecetteDTO createRecetteFromDTO(RecetteDTO dto) {
        Recette recette = new Recette();
        recette.setNom(dto.getNom());
        recette.setDescription(dto.getDescription());
        recette.setQuantiteTotale(dto.getQuantiteTotale());
        recette.setActif(dto.getActif() != null ? dto.getActif() : true);

        if (dto.getProduitNom() != null) {
            produitRepository.findByNom(dto.getProduitNom())
                    .ifPresent(recette::setProduit);
        }

        return toDTO(recetteRepository.save(recette));
    }

    // ✅ update depuis DTO
    public RecetteDTO updateRecetteFromDTO(Long id, RecetteDTO dto) {
        Recette recette = recetteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recette not found"));

        recette.setNom(dto.getNom());
        recette.setDescription(dto.getDescription());
        recette.setQuantiteTotale(dto.getQuantiteTotale());
        recette.setActif(dto.getActif());

        if (dto.getProduitNom() != null) {
            produitRepository.findByNom(dto.getProduitNom())
                    .ifPresent(recette::setProduit);
        }

        return toDTO(recetteRepository.save(recette));
    }

    public void deleteRecette(Long id) {
        recetteRepository.deleteById(id);
    }

    public List<LigneRecette> getLignesByRecette(Long recetteId) {
        return ligneRecetteRepository.findByRecetteId(recetteId);
    }

    public LigneRecette addLigneRecette(Long recetteId, LigneRecette ligne) {
        Recette recette = recetteRepository.findById(recetteId)
                .orElseThrow(() -> new RuntimeException("Recette not found"));
        ligne.setRecette(recette);
        return ligneRecetteRepository.save(ligne);
    }

    public void deleteLigneRecette(Long id) {
        ligneRecetteRepository.deleteById(id);
    }
}
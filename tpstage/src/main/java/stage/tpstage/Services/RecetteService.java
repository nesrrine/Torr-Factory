package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.entity.LigneRecette;
import stage.tpstage.entity.Produit;
import stage.tpstage.entity.Recette;
import stage.tpstage.repository.LigneRecetteRepository;
import stage.tpstage.repository.ProduitRepository;
import stage.tpstage.repository.RecetteRepository;

import java.util.List;

@Service
public class RecetteService {

    @Autowired
    private RecetteRepository recetteRepository;

    @Autowired
    private LigneRecetteRepository ligneRecetteRepository;

    @Autowired
    private ProduitRepository produitRepository;

    public List<Recette> getAllRecettes() {
        return recetteRepository.findAll();
    }

    public List<Recette> getRecettesActives() {
        return recetteRepository.findByActifTrue();
    }

    public Recette getRecetteById(Long id) {
        return recetteRepository.findById(id).orElse(null);
    }

    public Recette createRecette(Recette recette) {
        if (recette.getProduit() != null && recette.getProduit().getId() != null) {
            Produit produit = produitRepository.findById(recette.getProduit().getId()).orElse(null);
            recette.setProduit(produit);
        }
        return recetteRepository.save(recette);
    }

    public Recette updateRecette(Long id, Recette recette) {
        recette.setId(id);
        return recetteRepository.save(recette);
    }

    public void deleteRecette(Long id) {
        recetteRepository.deleteById(id);
    }

    public List<LigneRecette> getLignesByRecette(Long recetteId) {
        return ligneRecetteRepository.findByRecetteId(recetteId);
    }

    public LigneRecette addLigneRecette(LigneRecette ligne) {
        return ligneRecetteRepository.save(ligne);
    }

    public void deleteLigneRecette(Long id) {
        ligneRecetteRepository.deleteById(id);
    }
}

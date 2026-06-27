package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.Recette;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecetteRepository extends JpaRepository<Recette, Long> {
    List<Recette> findByActifTrue();
    Optional<Recette> findByNom(String nom);
    List<Recette> findByProduitId(Long produitId);
}

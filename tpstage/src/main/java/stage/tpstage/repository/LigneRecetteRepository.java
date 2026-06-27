package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.LigneRecette;

import java.util.List;

@Repository
public interface LigneRecetteRepository extends JpaRepository<LigneRecette, Long> {
    List<LigneRecette> findByRecetteId(Long recetteId);
    List<LigneRecette> findByLotId(Long lotId);
}

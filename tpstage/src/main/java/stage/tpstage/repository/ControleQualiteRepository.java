package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.ControleQualite;

import java.util.List;

@Repository
public interface ControleQualiteRepository extends JpaRepository<ControleQualite, Long> {
    List<ControleQualite> findByLotId(Long lotId);
    List<ControleQualite> findByConformeFalse();
    List<ControleQualite> findByControleurId(Long controleurId);
}

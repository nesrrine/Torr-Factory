package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.ProfilTorréfaction;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfilTorréfactionRepository extends JpaRepository<ProfilTorréfaction, Long> {
    List<ProfilTorréfaction> findByActifTrue();
    List<ProfilTorréfaction> findByTypeCafe(ProfilTorréfaction.TypeCafe typeCafe);
    Optional<ProfilTorréfaction> findByNom(String nom);
}

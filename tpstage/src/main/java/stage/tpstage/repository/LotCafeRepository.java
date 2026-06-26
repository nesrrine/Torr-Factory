package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.LotCafe;
import stage.tpstage.entity.LotCafe;

import java.util.List;
import java.util.Optional;

@Repository
public interface LotCafeRepository extends JpaRepository<LotCafe, Long> {
    Optional<LotCafe> findByNumeroLot(String numeroLot);
    List<LotCafe> findByStatut(LotCafe.StatutLot statut);
    List<LotCafe> findByTypeCafe(LotCafe.TypeCafe typeCafe);
}

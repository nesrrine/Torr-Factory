package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stage.tpstage.entity.LigneCommande;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Long> {
}


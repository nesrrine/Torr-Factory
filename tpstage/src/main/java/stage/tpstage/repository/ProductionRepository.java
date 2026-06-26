package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.Production;

import java.util.List;

@Repository
public interface ProductionRepository extends JpaRepository<Production, Long> {
    List<Production> findByStatut(Production.StatutProduction statut);
    List<Production> findByOperateur(User operateur);
}
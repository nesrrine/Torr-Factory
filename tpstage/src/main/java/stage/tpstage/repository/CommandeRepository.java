package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stage.tpstage.entity.Commande;
import stage.tpstage.entity.User;

import java.util.List;
import java.util.Optional;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
    Optional<Commande> findByNumeroCommande(String numeroCommande);

    List<Commande> findByClient(User client);

    List<Commande> findByStatut(Commande.StatutCommande statut);

}
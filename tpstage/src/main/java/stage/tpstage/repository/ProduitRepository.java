package stage.tpstage.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.Produit;
import java.util.Optional;


import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    Optional<Produit> findByReference(String reference);
    List<Produit> findByDisponible(Boolean disponible);
    List<Produit> findByStockDisponibleKgLessThan(Double stock);
}

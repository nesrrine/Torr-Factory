package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.Machine;
import java.util.Optional;


import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    Optional<Machine> findByNumeroSerie(String numeroSerie);
    List<Machine> findByStatut(Machine.StatutMachine statut);
}
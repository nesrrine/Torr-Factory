package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.Machine;
import stage.tpstage.entity.Maintenance;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByMachine(Machine machine);
    List<Maintenance> findByStatut(Maintenance.StatutMaintenance statut);
}
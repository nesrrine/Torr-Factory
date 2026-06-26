package stage.tpstage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stage.tpstage.entity.*;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<stage.tpstage.entity.User, Long> {
    Optional<stage.tpstage.entity.User> findByUsername(String username);
    Optional<stage.tpstage.entity.User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    List<stage.tpstage.entity.User> findByIsActive(Boolean isActive);
}
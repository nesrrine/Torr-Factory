package stage.tpstage.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleType name;

    public enum RoleType {
        ROLE_ADMIN,
        ROLE_PRODUCTION_MANAGER,
        ROLE_WORKER,
        ROLE_MAINTENANCE,
        ROLE_CLIENT
    }
}
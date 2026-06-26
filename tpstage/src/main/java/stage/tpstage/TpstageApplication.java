package stage.tpstage;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import stage.tpstage.entity.Role;
import stage.tpstage.repository.RoleRepository;

@SpringBootApplication
public class TpstageApplication {

    public static void main(String[] args) {
        SpringApplication.run(TpstageApplication.class, args);
    }

    @Bean
    CommandLineRunner initRoles(RoleRepository repo) {
        return args -> {

            if (repo.count() == 0) {

                Role r1 = new Role();
                r1.setName(Role.RoleType.ROLE_CLIENT);
                repo.save(r1);

                Role r2 = new Role();
                r2.setName(Role.RoleType.ROLE_ADMIN);
                repo.save(r2);

                Role r3 = new Role();
                r3.setName(Role.RoleType.ROLE_WORKER);
                repo.save(r3);

                Role r4 = new Role();
                r4.setName(Role.RoleType.ROLE_MAINTENANCE);
                repo.save(r4);

                Role r5 = new Role();
                r5.setName(Role.RoleType.ROLE_PRODUCTION_MANAGER);
                repo.save(r5);

                System.out.println("✅ Roles inserted successfully");
            }
        };
    }
}
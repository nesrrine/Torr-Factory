package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import stage.tpstage.Security.JwtUtils;
import stage.tpstage.Security.UserDetailsImpl;
import stage.tpstage.dto.*;
import stage.tpstage.entity.Role;
import stage.tpstage.entity.User;
import stage.tpstage.repository.RoleRepository;
import stage.tpstage.repository.UserRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    // ---------------- LOGIN ----------------
    public JwtResponse authenticateUser(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(
                jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        );
    }

    // ---------------- REGISTER ----------------
    public MessageResponse registerUser(SignupRequest signUpRequest) {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Username existe déjà!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email existe déjà!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());

        Set<Role> roles = new HashSet<>();

        Set<String> strRoles = signUpRequest.getRoles();

        if (strRoles == null || strRoles.isEmpty()) {

            Role clientRole = roleRepository.findByName(Role.RoleType.ROLE_CLIENT)
                    .orElseThrow(() -> new RuntimeException("ROLE_CLIENT missing in DB"));

            roles.add(clientRole);

        } else {

            for (String role : strRoles) {

                switch (role.toUpperCase()) {

                    case "ADMIN":
                        roles.add(roleRepository.findByName(Role.RoleType.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("ROLE_ADMIN missing")));
                        break;

                    case "PRODUCTION_MANAGER":
                        roles.add(roleRepository.findByName(Role.RoleType.ROLE_PRODUCTION_MANAGER)
                                .orElseThrow(() -> new RuntimeException("ROLE_PM missing")));
                        break;

                    case "WORKER":
                        roles.add(roleRepository.findByName(Role.RoleType.ROLE_WORKER)
                                .orElseThrow(() -> new RuntimeException("ROLE_WORKER missing")));
                        break;

                    case "MAINTENANCE":
                        roles.add(roleRepository.findByName(Role.RoleType.ROLE_MAINTENANCE)
                                .orElseThrow(() -> new RuntimeException("ROLE_MAINTENANCE missing")));
                        break;

                    default:
                        roles.add(roleRepository.findByName(Role.RoleType.ROLE_CLIENT)
                                .orElseThrow(() -> new RuntimeException("ROLE_CLIENT missing")));
                }
            }
        }

        user.setRoles(roles);
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }
}
package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.entity.ProfilTorréfaction;
import stage.tpstage.repository.ProfilTorréfactionRepository;

import java.util.List;

@Service
public class ProfilTorréfactionService {

    @Autowired
    private ProfilTorréfactionRepository profilRepository;

    public List<ProfilTorréfaction> getAllProfils() {
        return profilRepository.findAll();
    }

    public List<ProfilTorréfaction> getProfilsActifs() {
        return profilRepository.findByActifTrue();
    }

    public ProfilTorréfaction getProfilById(Long id) {
        return profilRepository.findById(id).orElse(null);
    }

    public ProfilTorréfaction createProfil(ProfilTorréfaction profil) {
        return profilRepository.save(profil);
    }

    public ProfilTorréfaction updateProfil(Long id, ProfilTorréfaction profil) {
        profil.setId(id);
        return profilRepository.save(profil);
    }

    public void deleteProfil(Long id) {
        profilRepository.deleteById(id);
    }
}

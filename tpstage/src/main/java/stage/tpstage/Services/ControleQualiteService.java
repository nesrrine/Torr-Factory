package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.entity.ControleQualite;
import stage.tpstage.entity.LotCafe;
import stage.tpstage.repository.ControleQualiteRepository;
import stage.tpstage.repository.LotCafeRepository;

import java.util.List;

@Service
public class ControleQualiteService {

    @Autowired
    private ControleQualiteRepository controleRepository;

    @Autowired
    private LotCafeRepository lotRepository;

    public List<ControleQualite> getAllControles() {
        return controleRepository.findAll();
    }

    public List<ControleQualite> getControlesByLot(Long lotId) {
        return controleRepository.findByLotId(lotId);
    }

    public List<ControleQualite> getControlesNonConformes() {
        return controleRepository.findByConformeFalse();
    }

    public ControleQualite getControleById(Long id) {
        return controleRepository.findById(id).orElse(null);
    }

    public ControleQualite createControle(ControleQualite controle) {
        LotCafe lot = lotRepository.findById(controle.getLot().getId()).orElse(null);
        if (lot != null) {
            controle.setLot(lot);
        }
        return controleRepository.save(controle);
    }

    public ControleQualite updateControle(Long id, ControleQualite controle) {
        controle.setId(id);
        return controleRepository.save(controle);
    }

    public void deleteControle(Long id) {
        controleRepository.deleteById(id);
    }
}

package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stage.tpstage.dto.*;
import stage.tpstage.entity.*;
import stage.tpstage.repository.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private LotCafeRepository lotCafeRepository;

    @Autowired
    private ProductionRepository productionRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private ProduitRepository produitRepository;

    public DashboardDTO getDashboardData() {
        StatistiquesGenerales stats = getStatistiquesGenerales();
        List<ProductionMensuelle> productionMensuelle = getProductionMensuelle();
        List<StockProduit> stocksFaibles = getStocksFaibles();
        List<MachineStatut> statutsMachines = getStatutsMachines();
        List<CommandeRecente> commandesRecentes = getCommandesRecentes();

        return new DashboardDTO(stats, productionMensuelle, stocksFaibles, statutsMachines, commandesRecentes);
    }

    private StatistiquesGenerales getStatistiquesGenerales() {
        Long nombreLots = lotCafeRepository.count();
        Long nombreProductions = productionRepository.count();
        Long nombreCommandes = commandeRepository.count();
        Long nombreMachines = machineRepository.count();

        Double stockTotalKg = produitRepository.findAll().stream()
                .mapToDouble(Produit::getStockDisponibleKg)
                .sum();

        LocalDate debutMois = LocalDate.now().withDayOfMonth(1);
        Double chiffreAffaireMois = commandeRepository.findAll().stream()
                .filter(c -> c.getDateCommande().isAfter(debutMois) || c.getDateCommande().isEqual(debutMois))
                .filter(c -> !c.getStatut().equals(Commande.StatutCommande.ANNULEE))
                .mapToDouble(Commande::getMontantTotal)
                .sum();

        Integer commandesEnCours = commandeRepository.findByStatut(Commande.StatutCommande.EN_PREPARATION).size() +
                commandeRepository.findByStatut(Commande.StatutCommande.CONFIRMEE).size();

        Integer machinesEnPanne = machineRepository.findByStatut(Machine.StatutMachine.HORS_SERVICE).size();

        return new StatistiquesGenerales(
                nombreLots,
                nombreProductions,
                nombreCommandes,
                nombreMachines,
                stockTotalKg,
                chiffreAffaireMois,
                commandesEnCours,
                machinesEnPanne
        );
    }

    private List<ProductionMensuelle> getProductionMensuelle() {
        LocalDate sixMoisAvant = LocalDate.now().minusMonths(6);

        Map<String, List<Production>> productionParMois = productionRepository.findAll().stream()
                .filter(p -> p.getDateTorrefaction() != null)
                .filter(p -> p.getDateTorrefaction().isAfter(sixMoisAvant))
                .collect(Collectors.groupingBy(p ->
                        p.getDateTorrefaction().format(DateTimeFormatter.ofPattern("yyyy-MM"))
                ));

        List<ProductionMensuelle> result = new ArrayList<>();
        for (Map.Entry<String, List<Production>> entry : productionParMois.entrySet()) {
            Double quantiteTotale = entry.getValue().stream()
                    .mapToDouble(Production::getQuantiteTorrefieeKg)
                    .sum();

            result.add(new ProductionMensuelle(
                    entry.getKey(),
                    quantiteTotale,
                    entry.getValue().size()
            ));
        }

        return result;
    }

    private List<StockProduit> getStocksFaibles() {
        return produitRepository.findAll().stream()
                .filter(p -> p.getStockDisponibleKg() < p.getStockMiniKg())
                .map(p -> {
                    double pourcentage = (p.getStockDisponibleKg() / p.getStockMiniKg()) * 100;
                    return new StockProduit(
                            p.getNom(),
                            p.getStockDisponibleKg(),
                            p.getStockMiniKg(),
                            pourcentage
                    );
                })
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<MachineStatut> getStatutsMachines() {
        return machineRepository.findAll().stream()
                .map(m -> {
                    Integer jours = null;
                    if (m.getDateDerniereMaintenance() != null) {
                        jours = (int) ChronoUnit.DAYS.between(m.getDateDerniereMaintenance(), LocalDate.now());
                    }
                    return new MachineStatut(
                            m.getNom(),
                            m.getStatut().name(),
                            jours
                    );
                })
                .collect(Collectors.toList());
    }

    private List<CommandeRecente> getCommandesRecentes() {
        return commandeRepository.findAll().stream()
                .sorted((c1, c2) -> c2.getDateCommande().compareTo(c1.getDateCommande()))
                .limit(10)
                .map(c -> new CommandeRecente(
                        c.getNumeroCommande(),
                        c.getClient().getFullName(),
                        c.getStatut().name(),
                        c.getMontantTotal(),
                        c.getDateCommande().toString()
                ))
                .collect(Collectors.toList());
    }
}
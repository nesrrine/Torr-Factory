package stage.tpstage.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stage.tpstage.dto.*;
import stage.tpstage.entity.*;
import stage.tpstage.repository.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProduitRepository produitRepository;

    public List<CommandeDTO> getAllCommandes() {
        return commandeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommandeDTO getCommandeById(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        return convertToDTO(commande);
    }

    @Transactional
    public CommandeDTO createCommande(CommandeCreateRequest request) {
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        Commande commande = new Commande();
        commande.setNumeroCommande(generateNumeroCommande());
        commande.setClient(client);
        commande.setDateCommande(LocalDate.now());
        commande.setDateLivraisonPrevue(request.getDateLivraisonPrevue());
        commande.setAdresseLivraison(request.getAdresseLivraison());
        commande.setStatut(Commande.StatutCommande.EN_ATTENTE);

        double montantTotal = 0.0;

        for (LigneCommandeRequest ligneRequest : request.getLignes()) {
            Produit produit = produitRepository.findById(ligneRequest.getProduitId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

            if (produit.getStockDisponibleKg() < ligneRequest.getQuantiteKg()) {
                throw new RuntimeException("Stock insuffisant pour le produit: " + produit.getNom());
            }

            LigneCommande ligne = new LigneCommande();
            ligne.setCommande(commande);
            ligne.setProduit(produit);
            ligne.setQuantiteKg(ligneRequest.getQuantiteKg());
            ligne.setPrixUnitaire(produit.getPrixKg());
            ligne.setSousTotal(ligneRequest.getQuantiteKg() * produit.getPrixKg());

            commande.getLignes().add(ligne);
            montantTotal += ligne.getSousTotal();

            // Mise à jour du stock
            produit.setStockDisponibleKg(produit.getStockDisponibleKg() - ligneRequest.getQuantiteKg());
            produitRepository.save(produit);
        }

        commande.setMontantTotal(montantTotal);
        Commande saved = commandeRepository.save(commande);
        return convertToDTO(saved);
    }

    @Transactional
    public CommandeDTO updateStatut(Long id, Commande.StatutCommande statut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        commande.setStatut(statut);
        Commande saved = commandeRepository.save(commande);
        return convertToDTO(saved);
    }

    public List<CommandeDTO> getCommandesByClient(Long clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        return commandeRepository.findByClient(client).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CommandeDTO> getCommandesByStatut(Commande.StatutCommande statut) {
        return commandeRepository.findByStatut(statut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private String generateNumeroCommande() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = commandeRepository.count() + 1;
        return String.format("CMD-%s-%04d", date, count);
    }

    private CommandeDTO convertToDTO(Commande commande) {
        CommandeDTO dto = new CommandeDTO();
        dto.setId(commande.getId());
        dto.setNumeroCommande(commande.getNumeroCommande());
        dto.setClientId(commande.getClient().getId());
        dto.setClientNom(commande.getClient().getFullName());
        dto.setDateCommande(commande.getDateCommande());
        dto.setDateLivraisonPrevue(commande.getDateLivraisonPrevue());
        dto.setStatut(commande.getStatut().name());
        dto.setMontantTotal(commande.getMontantTotal());
        dto.setAdresseLivraison(commande.getAdresseLivraison());

        List<LigneCommandeDTO> lignesDTO = commande.getLignes().stream()
                .map(this::convertLigneToDTO)
                .collect(Collectors.toList());
        dto.setLignes(lignesDTO);

        return dto;
    }

    private LigneCommandeDTO convertLigneToDTO(LigneCommande ligne) {
        LigneCommandeDTO dto = new LigneCommandeDTO();
        dto.setId(ligne.getId());
        dto.setProduitId(ligne.getProduit().getId());
        dto.setProduitNom(ligne.getProduit().getNom());
        dto.setQuantiteKg(ligne.getQuantiteKg());
        dto.setPrixUnitaire(ligne.getPrixUnitaire());
        dto.setSousTotal(ligne.getSousTotal());
        return dto;
    }
}



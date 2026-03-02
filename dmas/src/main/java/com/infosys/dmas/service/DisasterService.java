package com.infosys.dmas.service;

import com.infosys.dmas.dto.CapAlert;
import com.infosys.dmas.model.DisasterAlert;
import com.infosys.dmas.dto.AlertItem;
import com.infosys.dmas.dto.RssFeed; // Root wrapper for Jackson
import com.infosys.dmas.repository.DisasterAlertRepository;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DisasterService {

    @Autowired
    private DisasterAlertRepository alertRepository;

    private final String SACHET_URL = "https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml";

    // FETCH & STORE: Runs every 10 minutes (600,000 ms)
    @Scheduled(fixedRate = 600000, initialDelay = 5000)
    public void syncWithSachet() {
        try {
            System.out.println("DEBUG: SYNC STARTED AT " + LocalDateTime.now());
            RestTemplate restTemplate = new RestTemplate();
            // Fetching the raw XML string
            String xmlData = restTemplate.getForObject(SACHET_URL, String.class);

            // Initialize XmlMapper for Jackson
            XmlMapper xmlMapper = new XmlMapper();

            // Deserialize the XML into our RssFeed object
            RssFeed feed = xmlMapper.readValue(xmlData, RssFeed.class);

            // Check if the feed and channel exist to avoid NullPointerExceptions
            if (feed != null && feed.getChannel() != null && feed.getChannel().getItems() != null) {
                List<AlertItem> items = feed.getChannel().getItems();
                for (AlertItem item : items) {
                    // Logic to store in database if it doesn't already exist
                    if (alertRepository.findByIdentifier(item.getGuid()).isEmpty()) {
                        saveNewAlert(item);
                        // Second: Trigger the detailed fetch immediately
                        // This calls the FetchXMLFile?identifier=... URL
                        fetchDetailedAlert(item.getGuid());
                    }
                }
                System.out.println("Sync Successful: Processed " + items.size() + " items.");
            }
        } catch (Exception e) {
            System.err.println("Sachet Sync Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void saveNewAlert(AlertItem item) {
        DisasterAlert alert = new DisasterAlert();
        alert.setIdentifier(item.getGuid());
        alert.setHeadline(item.getTitle());
        alert.setDescription(item.getDescription());
        alert.setSentTime(LocalDateTime.now());
        alert.setVerified(false); // New alerts start as unverified
        String title = item.getTitle().toLowerCase();

        // 1. AUTOMATIC CATEGORIZATION (TAGGING)
        if (title.contains("flood") || title.contains("rain") || title.contains("cwc"))
            alert.setType("Flood");
        else if (title.contains("cyclone") || title.contains("storm") || title.contains("wind"))
            alert.setType("Cyclone");
        else if (title.contains("quake") || title.contains("seismic"))
            alert.setType("Earthquake");
        else if (title.contains("fire") || title.contains("fsi"))
            alert.setType("Forest Fire");
        else if (title.contains("heat"))
            alert.setType("Heatwave");
        else
            alert.setType("General Warning");

        // 2. AUTOMATIC SEVERITY ASSIGNMENT
        if (title.contains("extreme") || title.contains("critical"))
            alert.setSeverity("Extreme");
        else if (title.contains("severe") || title.contains("heavy"))
            alert.setSeverity("Severe");
        else if (title.contains("moderate"))
            alert.setSeverity("Moderate");
        else
            alert.setSeverity("Watch");

        // 3. LOCATION EXTRACTION
        // Sachet titles often look like "Moderate Rain - Haryana"
        if (item.getTitle().contains("-")) {
            String[] parts = item.getTitle().split("-");
            alert.setArea(parts[parts.length - 1].trim());
        } else {
            alert.setArea("India-Wide");
        }

        alertRepository.save(alert);
    }

    public void fetchDetailedAlert(String identifier) {
        // Note: The identifier in the URL usually drops the "IN-" prefix
        String cleanId = identifier.replace("IN-", "");
        String detailUrl = "https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=" + cleanId;

        try {
            RestTemplate restTemplate = new RestTemplate();
            String xmlData = restTemplate.getForObject(detailUrl, String.class);

            XmlMapper xmlMapper = new XmlMapper();
            // Since the XML uses namespaces (cap:alert), we configure the mapper
            CapAlert detail = xmlMapper.readValue(xmlData, CapAlert.class);
            System.out.println(xmlData);
            // Now update your database with the EXTRA details (instructions, etc.)
            updateExistingAlert(detail);

        } catch (Exception e) {
            System.err.println("Could not fetch details for ID " + identifier + ": " + e.getMessage());
        }
    }
    @Transactional // Ensures the database update happens in one safe block
    public void updateExistingAlert(CapAlert detail) {
        // 1. Find the alert we saved earlier via the RSS feed
        // Note: Use the 'identifier' from the CAP XML to match our DB 'identifier'
        Optional<DisasterAlert> alertOpt = alertRepository.findByIdentifier(detail.getIdentifier());

        if (alertOpt.isPresent()) {
            DisasterAlert alert = alertOpt.get();
            CapAlert.CapInfo info = detail.getInfo();

            if (info != null) {
                // 2. Map the NEW detailed fields into our existing Entity
                alert.setHeadline(info.getHeadline()); // Usually more detailed than RSS title
                alert.setDescription(info.getDescription());

                // These fields are only available in the detailed XML:
                // We can add these columns to our DisasterAlert model if they aren't there!
                alert.setInstruction(info.getInstruction());
                alert.setSeverity(info.getSeverity());

                if (info.getArea() != null) {
                    alert.setArea(info.getArea().getAreaDesc());
                }

                // 3. Save the updated entity
                // Spring Data JPA's save() performs an UPDATE if the ID already exists
                alertRepository.save(alert);
                System.out.println(">>> [DEBUG] Successfully updated details for ID: " + alert.getIdentifier());
            }
        } else {
            System.out.println(">>> [DEBUG] Could not find existing alert for ID: " + detail.getIdentifier());
        }
    }
}
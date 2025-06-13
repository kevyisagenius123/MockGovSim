package com.mockgovsim.config;

import com.mockgovsim.domain.*;
import com.mockgovsim.dto.CandidacyDeclarationRequest;
import com.mockgovsim.repository.*;
import com.mockgovsim.service.CandidateService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final CandidateRepository candidateRepository;
    private final CandidateService candidateService;
    private final PollingFirmRepository pollingFirmRepository;
    private final PollRepository pollRepository;
    private final BillRepository billRepository;
    private final PledgedVoteRepository pledgedVoteRepository;
    private final UserRoleRepository userRoleRepository;
    private final @Lazy PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CountryRepository countryRepository,
                           CandidateRepository candidateRepository,
                           CandidateService candidateService,
                           PollingFirmRepository pollingFirmRepository,
                           PollRepository pollRepository,
                           BillRepository billRepository,
                           PledgedVoteRepository pledgedVoteRepository,
                           UserRoleRepository userRoleRepository,
                           @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.countryRepository = countryRepository;
        this.candidateRepository = candidateRepository;
        this.candidateService = candidateService;
        this.pollingFirmRepository = pollingFirmRepository;
        this.pollRepository = pollRepository;
        this.billRepository = billRepository;
        this.pledgedVoteRepository = pledgedVoteRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedInitialUsersAndData();
        }

        if (candidateRepository.count() == 0) {
            seedCandidates();
        }
        
        if (pollingFirmRepository.count() == 0) {
            seedPolls();
        }

        if (billRepository.count() == 0) {
            seedBills();
        }
    }

    private void seedInitialUsersAndData() {
        // Create a default admin user
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@mockgovsim.com");
        adminUser.setPassword(passwordEncoder.encode("password")); // Use a strong password in production!
        adminUser.setAccountNonExpired(true);
        adminUser.setAccountNonLocked(true);
        adminUser.setCredentialsNonExpired(true);
        adminUser.setEnabled(true);


        UserRole adminRole = new UserRole();
        adminRole.setUser(adminUser);
        adminRole.setType(RoleType.GAME_ADMIN);
        adminRole.setStartDate(LocalDate.now());
        adminRole.setActive(true);
        
        UserRole speakerRole = new UserRole();
        speakerRole.setUser(adminUser);
        speakerRole.setType(RoleType.SPEAKER);
        speakerRole.setStartDate(LocalDate.now());
        speakerRole.setActive(true);

        adminUser.setRoles(Set.of(adminRole, speakerRole));
        userRepository.save(adminUser);

        // Create a sample country
        Country usa = new Country();
        usa.setName("United States of America");
        usa.setCode("USA");
        usa.setGeojson("{ \"type\": \"Feature\", \"properties\": {}, \"geometry\": null }");
        countryRepository.save(usa);
    }

    private void seedCandidates() {
        User adminUser = userRepository.findByUsername("admin")
                .orElseThrow(() -> new RuntimeException("Admin user not found for seeding candidates"));

        CandidacyDeclarationRequest candidate1Dto = new CandidacyDeclarationRequest();
        candidate1Dto.setFullName("John Doe");
        candidate1Dto.setParty("Independence Party");
        candidate1Dto.setOffice("President");
        candidate1Dto.setElectionType("Federal");
        candidate1Dto.setRegionCode("USA");
        candidateService.declareCandidacy(candidate1Dto, adminUser);

        CandidacyDeclarationRequest candidate2Dto = new CandidacyDeclarationRequest();
        candidate2Dto.setFullName("Jane Smith");
        candidate2Dto.setParty("Progressive Alliance");
        candidate2Dto.setOffice("President");
        candidate2Dto.setElectionType("Federal");
        candidate2Dto.setRegionCode("USA");
        candidateService.declareCandidacy(candidate2Dto, adminUser);
    }

    private void seedPolls() {
        User pollsterUser = new User();
        pollsterUser.setUsername("pollster");
        pollsterUser.setEmail("pollster@mockgovsim.com");
        pollsterUser.setPassword(passwordEncoder.encode("password"));
        pollsterUser.setAccountNonExpired(true);
        pollsterUser.setAccountNonLocked(true);
        pollsterUser.setCredentialsNonExpired(true);
        pollsterUser.setEnabled(true);
        userRepository.save(pollsterUser);

        PollingFirm firm1 = new PollingFirm();
        firm1.setName("National Polling");
        firm1.setDescription("A reputable, long-standing polling firm.");
        firm1.setUserId(pollsterUser.getId());
        firm1.setApproved(true);
        firm1.setReputationScore(85);
        firm1.setBiasRating("Center");
        pollingFirmRepository.save(firm1);

        createPoll(firm1, "Early Election Poll", "John Doe", 45.5, "Jane Smith", 42.0, 10, true, "National", "Presidential");
        createPoll(firm1, "Mid-Campaign Poll", "John Doe", 47.0, "Jane Smith", 44.5, 5, true, "National", "Presidential");
        createPoll(firm1, "Final Week Poll", "John Doe", 48.2, "Jane Smith", 46.8, 2, true, "National", "Presidential");
        createPoll(firm1, "Unpublished Test Poll", "John Doe", 50.0, "Jane Smith", 40.0, 1, false, "National", "Presidential");
        createPoll(firm1, "California Senate Race", "Alex Johnson", 51.0, "Maria Garcia", 49.0, 8, true, "CA", "Senate");

        User altPollsterUser = new User();
        altPollsterUser.setUsername("alt-pollster");
        altPollsterUser.setEmail("alt@poll.com");
        altPollsterUser.setPassword(passwordEncoder.encode("password"));
        userRepository.save(altPollsterUser);

        PollingFirm firm2 = new PollingFirm();
        firm2.setName("Alternative Insights");
        firm2.setDescription("A newer firm using modern techniques.");
        firm2.setUserId(altPollsterUser.getId());
        firm2.setApproved(true);
        firm2.setReputationScore(75);
        firm2.setBiasRating("Leans Progressive");
        pollingFirmRepository.save(firm2);

        createPoll(firm2, "Tech Sector Impact on Presidency", "John Doe", 44.0, "Jane Smith", 51.5, 12, true, "National", "Presidential");
        createPoll(firm2, "Florida Governor Poll", "Ron DeSantis", 49.0, "Charlie Crist", 48.0, 20, true, "FL", "Gubernatorial");
        createPoll(firm2, "Texas Senate Poll (Unapproved Firm)", "Ted Cruz", 52.0, "Beto O'Rourke", 45.0, 3, true, "TX", "Senate");
    }
    
    private void seedBills() {
        User adminUser = userRepository.findByUsername("admin")
                .orElseThrow(() -> new RuntimeException("Admin user not found for seeding bills"));

        Bill bill1 = new Bill("Infrastructure Revitalization Act", "A bill to fund the repair and modernization of national infrastructure.", adminUser);
        billRepository.save(bill1);

        Bill bill2 = new Bill("Clean Energy Future Act", "A comprehensive bill to promote renewable energy sources and reduce carbon emissions.", adminUser);
        billRepository.save(bill2);
        
        seedPledgedVotes(bill1, bill2);
    }

    private void seedPledgedVotes(Bill bill1, Bill bill2) {
        User regularUser1 = createUser("user1", "user1@test.com", "password");
        User regularUser2 = createUser("user2", "user2@test.com", "password");
        User regularUser3 = createUser("user3", "user3@test.com", "password");
        userRepository.saveAll(Arrays.asList(regularUser1, regularUser2, regularUser3));

        PledgedVote vote1 = new PledgedVote(regularUser1, bill1, VoteOption.YEA);
        PledgedVote vote2 = new PledgedVote(regularUser2, bill1, VoteOption.NAY);
        PledgedVote vote3 = new PledgedVote(regularUser3, bill2, VoteOption.YEA);

        pledgedVoteRepository.saveAll(Arrays.asList(vote1, vote2, vote3));
    }

    private User createUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);

        UserRole voterRole = new UserRole();
        voterRole.setUser(user);
        voterRole.setType(RoleType.VOTER);
        voterRole.setStartDate(LocalDate.now());
        voterRole.setActive(true);
        
        user.setRoles(Set.of(voterRole));
        return user;
    }

    private void createPoll(PollingFirm firm, String title, String cand1Name, double cand1Pct, String cand2Name, double cand2Pct, int daysAgo, boolean published, String region, String electionType) {
        Poll poll = new Poll();
        poll.setFirm(firm);
        poll.setTitle(title);
        poll.setPollster(firm.getName());
        poll.setElectionType(electionType);
        poll.setRegion(region);
        poll.setStartDate(LocalDate.now().minusDays(daysAgo + 3));
        poll.setEndDate(LocalDate.now().minusDays(daysAgo));
        poll.setSampleSize(1000);
        poll.setMarginOfError(3.0);
        poll.setMethodology("Online Panel");
        poll.setPublished(published);

        PollResult result1 = new PollResult();
        result1.setPoll(poll);
        result1.setCandidateName(cand1Name);
        result1.setPercentage(cand1Pct);

        PollResult result2 = new PollResult();
        result2.setPoll(poll);
        result2.setCandidateName(cand2Name);
        result2.setPercentage(cand2Pct);

        poll.setResults(new ArrayList<>(Arrays.asList(result1, result2)));
        pollRepository.save(poll);
    }
} 
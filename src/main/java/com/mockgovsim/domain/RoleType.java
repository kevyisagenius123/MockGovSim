package com.mockgovsim.domain;

public enum RoleType {

    // I. Core User Roles
    VOTER,
    CANDIDATE,
    PARTY_MEMBER,
    PARTY_LEADER,
    OBSERVER,

    // II. Elected Office Roles (National)
    PRESIDENT,
    PRIME_MINISTER,
    VICE_PRESIDENT,
    SPEAKER,
    NATIONAL_ASSEMBLY_MEMBER,
    SENATOR,
    CABINET_MINISTER,

    // II. Elected Office Roles (Regional)
    GOVERNOR,
    CHIEF_MINISTER,
    STATE_LEGISLATOR,
    STATE_SENATOR,

    // II. Elected Office Roles (Local)
    MAYOR,
    CITY_COUNCILOR,
    COUNTY_EXECUTIVE,
    SCHOOL_BOARD_MEMBER,

    // III. Party Roles
    PARTY_CHAIR,
    PARTY_STRATEGIST,
    PLATFORM_DIRECTOR,
    WHIP,
    CANDIDATE_RECRUITER,

    // IV. Media & Narrative Roles
    JOURNALIST,
    FACT_CHECKER,
    DEBATE_HOST,
    PRESS_SECRETARY,
    AI_NARRATOR,

    // V. Game/Admin Roles
    GAME_ADMIN,
    ELECTION_COMMISSIONER,
    SCANDAL_ENGINE_OPERATOR,
    ENDORSEMENT_ENGINE_MANAGER,
    POLLSTER,
    MODERATOR,

    // VI. AI & Simulation Roles
    AI_CANDIDATE,
    AI_VOTER_BLOCK,
    AI_SCANDAL_GENERATOR,
    AI_ENDORSER,

    // VII. Cross-Country Roles
    AMBASSADOR,
    FOREIGN_MINISTER,
    REGIONAL_BLOC_REP,
    GLOBAL_DEBATE_REP
} 
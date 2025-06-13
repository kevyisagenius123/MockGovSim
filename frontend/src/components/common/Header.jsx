const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Elections', href: '/elections' },
    { name: 'Polling', href: '/polling' },
    {
        name: 'Results & Data',
        dropdown: [
            { name: 'Live Results Hub', href: '/results/live' },
            // { name: 'Past Election Results', href: '/past-election-results' },
        ]
    },
    // {
    //     name: 'Country Maps',
    //     dropdown: [
    //         { name: 'USA', href: '/map/USA' },
    //         { name: 'Canada', href: '/map/CAN' },
    //     ]
    // },
    // { name: 'Browse Candidates', href: '/candidates' },
] 
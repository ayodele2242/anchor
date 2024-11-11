export const languages = [
    {
        language: 'English',
        flag: 'us'
    },
    {
        language: 'French',
        flag: 'france'
    },
    {
        language: 'German',
        flag: 'germany'
    },
    {
        language: 'Russian',
        flag: 'russia'
    },
    {
        language: 'Spanish',
        flag: 'spain'
    }
];

export const notifications = [
    {
        icon: 'fas fa-cloud-download',
        subject: 'Download complete',
        description: 'lorem ipsum dolor djdj'
    },
    {
        icon: 'fas fa-cloud-upload',
        subject: 'Upload complete',
        description: 'lorem ipsum dolor djdj'
    }
];

export const userItems = [
    {
        icon: 'fas fa-user',
        label: 'Profile',
        short: 'profile',
        routeLink: 'profile',
        click: ''
    },
    {
        icon: 'fas fa-cog',
        label: 'Settings',
        short: 'settigs',
        routeLink: 'settings',
        click: ''
    },
    {
        icon: 'fas fa-unlock-alt',
        label: 'Lock Screen',
        short: 'lock_screen',
        routeLink: '',
        click: "lockScreen()"
    },
    {
        icon: 'fas fa-power-off',
        label: 'Logout',
        short: 'logout',
        routeLink: '',
        click: "logOut()"
    },
]


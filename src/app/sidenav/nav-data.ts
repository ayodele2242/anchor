import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'fas fa-home',
        label: 'Dashboard'
    },
    {
        routeLink: '#',
        icon: 'fas fa-users',
        label: 'Administrators',
        items: [
            {
                routeLink: 'admin-list',
                label: 'Administrators List'
            }
        ]
    },
    {
        routeLink: '#',
        icon: 'fas fa-users',
        label: 'Customers',
        items: [
            {
                routeLink: 'users-list',
                label: 'Customers List'
            }
        ]
    },
    {
        routeLink: 'brokers',
        icon: 'fas fa-chart-bar',
        label: 'Brokers'
    },
    {
        routeLink: 'products',
        icon: 'fas fa-box-open',
        label: 'Products',
        items: [
            {
                routeLink: 'product-variants',
                label: 'Variants',
            },
            {
                routeLink: 'products',
                label: 'Products',
            }
        ]
    },
    {
        routeLink: 'coupens',
        icon: 'fas fa-tags',
        label: 'Coupens',
        items: [
            {
                routeLink: 'coupens/list',
                label: 'List Coupens'
            },
            {
                routeLink: 'coupens/create',
                label: 'Create Coupens'
            }
        ]
    },
    {
        routeLink: 'pages',
        icon: 'fas fa-file',
        label: 'Pages'
    },
    {
        routeLink: 'media',
        icon: 'fas fa-camera',
        label: 'Media'
    },
    {
        routeLink: 'settings',
        icon: 'fas fa-cog',
        label: 'Settings',
        expanded: true,
        items: [
            {
                routeLink: 'settings/profile',
                label: 'Profile'
            },
            {
                routeLink: 'settings/customize',
                label: 'Customize'
            }
        ]
    },
];
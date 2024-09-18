import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routerLink: 'dashboard',
    icon: 'fa-solid fa-house',
    label: 'Dashboard',
  },
  {
    routerLink: 'dashboard',
    icon: 'fa-solid fa-house',
    label: 'Dashboard',
  },
  {
    routerLink: 'dashboard',
    icon: 'fa-solid fa-house',
    label: 'Dashboard',
    items: [
      {
        routerLink: 'dashboard/opcion1',
        icon: 'fa-solid fa-house',
        label: 'opcion 1',
      },
    ],
  },
  {
    routerLink: 'dashboard',
    icon: 'fa-solid fa-house',
    label: 'Dashboard',
  },
];

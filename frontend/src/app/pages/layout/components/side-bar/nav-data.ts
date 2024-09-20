import { Menu } from '../../../../models/menu.model';

export const navbarData: Menu[] = [
  {
    id: 1,
    id_padre: undefined,
    deshabilitado: false,
    url: 'dashboard',
    icon: 'fa-solid fa-chart-line',
    label: 'Dashboard',
  },
  {
    id: 2,
    id_padre: undefined,
    deshabilitado: false,
    url: 'usuarios',
    icon: 'fa-solid fa-users',
    label: 'Usuarios',
    expanded: false,
    sub_menus: [
      {
        id: 3,
        id_padre: 2,
        deshabilitado: false,
        url: 'usuarios/miUsuario',
        icon: 'fa-regular fa-user',
        label: 'Mi Usuario',
      },
      {
        id: 3,
        id_padre: 2,
        deshabilitado: false,
        url: 'usuarios/nuevo',
        icon: 'fa-solid  fa-user-plus',
        label: 'Nuevo Usuario',
      },
      {
        id: 3,
        id_padre: 2,
        deshabilitado: false,
        url: 'usuarios/list',
        icon: 'fa-solid fa-users-line',
        label: 'Todos',
      },
    ],
  },

  /*
  {
    id: 4,
    id_padre:undefined,
    deshabilitado:false,
    url: 'usuarios',
    icon: 'fa-solid fa-house',
    label: 'Usuarios',
    expanded:false,
    items: [
      {
        id: 5,
        id_padre:4,
        deshabilitado:false,
        url: 'dashboard/opcion1',
        icon: 'fa-solid fa-house',
        label: 'opcion 1',
      },
      {
        id: 6,
        id_padre:4,
        deshabilitado:false,
        url: 'dashboard/opcion1',
        icon: 'fa-solid fa-house',
        label: 'opcion 1',
      },

    ],
  },
  {
    id: 2,
    id_padre:undefined,
    deshabilitado:false,
    url: 'usuarios',
    icon: 'fa-solid fa-house',
    label: 'Usuarios',
    expanded:false,
    items: [
      {
        id: 3,
        id_padre:2,
        deshabilitado:false,
        url: 'dashboard/opcion1',
        icon: 'fa-solid fa-house',
        label: 'opcion 1',
        items: [
          {
            id: 9,
            id_padre:3,
            deshabilitado:false,
            url: 'dashboard/opcion1',
            icon: 'fa-solid fa-house',
            label: 'opcion 1',
          },
          {
            id: 10,
            id_padre:3,
            deshabilitado:false,
            url: 'dashboard/opcion1',
            icon: 'fa-solid fa-house',
            label: 'opcion 1',
          },

        ],
      },
      {
        id: 3,
        id_padre:2,
        deshabilitado:false,
        url: 'dashboard/opcion1',
        icon: 'fa-solid fa-house',
        label: 'opcion 1',
      },
    ],
  },*/
];

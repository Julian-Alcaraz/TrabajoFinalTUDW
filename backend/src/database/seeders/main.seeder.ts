import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Menu } from '../../menu/entities/menu.entity';
import { Rol } from '../../rol/entities/rol.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { codificarContrasenia } from '../../common/utils/bcrypt';
import { Localidad } from '../../localidad/entities/localidad.entity';
import { Barrio } from '../../barrio/entities/barrio.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Curso } from '../../curso/entities/curso.entity';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    try {
      // Repositories
      const rolORM = dataSource.getRepository(Rol);
      const usuarioORM = dataSource.getRepository(Usuario);
      const menuORM = dataSource.getRepository(Menu);
      const localidadORM = dataSource.getRepository(Localidad);
      const barrioORM = dataSource.getRepository(Barrio);
      const cursoORM = dataSource.getRepository(Curso);
      const institucionORM = dataSource.getRepository(Institucion);

      // Roles
      console.log('Seeding roles...');
      const roles = await rolORM.save([{ nombre: 'Administrador' }, { nombre: 'Profesional' }, { nombre: 'Acceso Info' }]);

      // Usuarios
      console.log('Seeding usuarios...');
      await usuarioORM.save([
        {
          nombre: 'Admin',
          apellido: 'Admin',
          email: 'Admin@gmail.com',
          contrasenia: codificarContrasenia('11111111'),
          dni: 11111112,
          fe_nacimiento: '2000-01-01',
          roles: [roles[0]], // admin
        },
        /*
        {
          nombre: 'Lucas',
          apellido: 'Puyol',
          email: 'lucasPujol@gmail.com',
          contrasenia: codificarContrasenia('12345678'),
          dni: 12345678,
          fe_nacimiento: '2000-01-01',
          roles: [roles[0]], // admin
        },
        {
          nombre: 'Fernando',
          apellido: 'Lascano',
          email: 'fernandoLascano@gmail.com',
          contrasenia: codificarContrasenia('12345679'),
          dni: 12345679,
          fe_nacimiento: '2000-01-01',
          roles: [roles[0]], // admin
        },
        */
      ]);

      // Menus
      // Menus que tienen hijos
      console.log('Seeding menus...');
      const menus = await menuORM.save([
        {
          url: 'dashboard',
          label: 'Graficos',
          orden: 1,
          icon: 'fa-solid fa-chart-line',
          roles: [roles[0], roles[1], roles[2]],
        },
        {
          url: 'chicos',
          label: 'Niños',
          orden: 3,
          icon: 'fas fa-child',
          roles: [roles[0], roles[1], roles[2]],
        },
        {
          url: 'consultas',
          label: 'Consultas',
          orden: 4,
          icon: 'fa-solid fa-kit-medical',
          roles: [roles[0], roles[1], roles[2]],
        },
        {
          url: 'administracion',
          label: 'Administración',
          orden: 5,
          icon: 'fa-solid fa-shield',
          roles: [roles[0]],
        },
        /*
        {
          url: 'miUsuario',
          label: 'Mi Usuario',
          orden: 6,
          icon: 'fa-solid fa-user',
          roles: [roles[0], roles[1], roles[2]],
          deshabilitado: true,
        },
        */
      ]);
      await menuORM.save(menus);
      // Menus que tienen padres

      const menusAdmin = await menuORM.save([
        {
          url: 'administracion/usuarios',
          label: 'Usuarios',
          orden: 7,
          icon: 'fa-solid fa-users',
          roles: [roles[0]],
          menu_padre: menus[3],
        },
        {
          url: 'administracion/instituciones',
          label: 'Instituciones',
          orden: 8,
          icon: 'fa-solid fa-school',
          roles: [roles[0]],
          menu_padre: menus[3],
        },
        {
          url: 'administracion/cursos',
          label: 'Cursos',
          orden: 9,
          icon: 'fa-solid fa-graduation-cap',
          roles: [roles[0]],
          menu_padre: menus[3],
        },
        {
          url: 'administracion/localidades',
          label: 'Localidades',
          orden: 10,
          icon: 'fa-solid fa-earth-americas',
          roles: [roles[0]],
          menu_padre: menus[3],
        },
        {
          url: 'administracion/barrios',
          label: 'Barrios',
          orden: 11,
          icon: 'fa-solid fa-location-dot',
          roles: [roles[0]],
          menu_padre: menus[3],
        },
        {
          url: 'administracion/datos',
          label: 'Datos',
          orden: 12,
          icon: 'fa-solid fa-file-import',
          roles: [roles[0]],
          menu_padre: menus[3],
        },
      ]);
      await menuORM.save(menusAdmin);

      const menus2 = await menuORM.save([
        {
          url: 'chicos/nuevo',
          label: 'Nuevo',
          orden: 6,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[1],
        },
        {
          url: 'chicos/list',
          label: 'Lista',
          orden: 7,
          icon: 'fa-solid fa-list-ol',
          roles: [roles[0], roles[1], roles[2]],
          menu_padre: menus[1],
        },
        {
          url: 'chicos/:id',
          label: 'Ver Chico',
          orden: 4,
          icon: '',
          roles: [roles[0], roles[1], roles[2]],
          menu_padre: menus[1],
          deshabilitado: true,
        },
        {
          url: 'chicos/:id/editar',
          label: 'Editar Chico',
          orden: 4,
          icon: '',
          roles: [roles[0], roles[1]],
          menu_padre: menus[1],
          deshabilitado: true,
        },
        {
          url: 'consultas/busqueda',
          label: 'Buscar',
          orden: 2,
          icon: 'fa-solid fa-magnifying-glass',
          roles: [roles[0], roles[1], roles[2]],
          menu_padre: menus[2],
        },
        {
          url: 'consultas/clinica/nueva',
          label: 'Clinica',
          orden: 4,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[2],
        },
        {
          url: 'consultas/odontologia/nueva',
          label: 'Odontologica',
          orden: 5,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[2],
        },
        {
          url: 'consultas/oftalmologia/nueva',
          label: 'Oftalmologica',
          orden: 6,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[2],
        },
        {
          url: 'consultas/fonoaudiologia/nueva',
          label: 'Fonoaudiologica',
          orden: 7,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[2],
        },
        {
          url: 'consultas/prevencion/nueva',
          label: 'Prevención',
          orden: 8,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[2],
        },
        {
          url: 'consultas/social/nueva',
          label: 'Trabajo Social',
          orden: 9,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[2],
        },
      ]);
      await menuORM.save(menus2);

      // Localidades
      console.log('Seeding localidades...');
      const localidades = await localidadORM.save([{ nombre: 'Neuquén' }, { nombre: 'Cipolletti' }, { nombre: 'Buenos Aires' }, { nombre: 'Misiones' }]);

      const neuquen = localidades[0];
      const cipolletti = localidades[1];
      const buenosAires = localidades[2];
      const misiones = localidades[3];

      console.log('Seeding barrios...');
      await barrioORM.save([
        // barrios sacados de la planilla clinica
        { nombre: 'Nuevo', localidad: neuquen },
        { nombre: 'Obrero A', localidad: neuquen },
        { nombre: 'Obrero B', localidad: neuquen },
        { nombre: 'Santa Elena', localidad: neuquen },
        { nombre: '130 Viviendas', localidad: neuquen },
        { nombre: 'La Alameda', localidad: neuquen },
        { nombre: 'Nueva Esperanza', localidad: neuquen },
        { nombre: 'Antartida Argentina', localidad: neuquen },
        { nombre: 'Costa sur', localidad: neuquen },
        { nombre: 'Puente 83', localidad: neuquen },
        { nombre: 'San Sebastian', localidad: neuquen },
        { nombre: '1200 viviendas', localidad: neuquen },
        { nombre: 'Don Bosco', localidad: neuquen },
        { nombre: 'San Jose (lomas de Zamora, Bs As)', localidad: buenosAires },
        { nombre: 'Seccion chacras', localidad: neuquen },
        { nombre: 'Villa Dolores-Posadas-Misiones', localidad: misiones },
        { nombre: 'Villarino', localidad: cipolletti },
        { nombre: 'El treinta', localidad: neuquen },
        { nombre: 'Rincon de los sauces-pehuenches (neuquen)', localidad: neuquen },
        { nombre: '2 de Febrero', localidad: neuquen },
        { nombre: '20 de Febrero', localidad: neuquen },
        { nombre: '10 de febrero', localidad: neuquen },
        { nombre: '4 de febrero', localidad: neuquen },
        { nombre: '4 de agosto', localidad: neuquen },
        { nombre: '1 de enero', localidad: neuquen },
        { nombre: 'Luis Piedra Buena', localidad: neuquen },
        { nombre: 'Ferri', localidad: neuquen },
        { nombre: 'Parque Norte', localidad: neuquen },
        { nombre: 'Obrero Argentino', localidad: neuquen }, // ESTA REPETIDO CON OBRERO A ? juli: nose lo dejo asi x las dudas
        { nombre: 'Ciudad de la Paz', localidad: neuquen },
        { nombre: 'Santo Domingo', localidad: neuquen },
        { nombre: 'distrito noreste', localidad: neuquen },
        { nombre: 'Las Cabañitas', localidad: neuquen },
        { nombre: 'Parque Industrial', localidad: neuquen },
        { nombre: 'Cinco Saltos', localidad: neuquen },
        { nombre: 'Anahi Mapu', localidad: neuquen },
        { nombre: 'Dvn', localidad: neuquen },
      ]);
      console.log('Seeding cursos...');
      await cursoORM.save([
        { nivel: 'Jardin', nombre: 'Sala de 3 Años' },
        { nivel: 'Jardin', nombre: 'Sala de 4 Años' },
        { nivel: 'Jardin', nombre: 'Sala de 5 Años' },
        { nivel: 'Primario', nombre: 'Primer Grado' },
        { nivel: 'Primario', nombre: 'Segundo Grado' },
        { nivel: 'Primario', nombre: 'Tercer Grado' },
        { nivel: 'Primario', nombre: 'Cuarto Grado' },
        { nivel: 'Primario', nombre: 'Quinto Grado' },
        { nivel: 'Primario', nombre: 'Sexto Grado' },
        { nivel: 'Primario', nombre: 'Septimo Grado' },
        /*
        {
          nivel: 'Secundario',
          nombre: 'Primer Año',
        },
        {
          nivel: 'Secundario',
          nombre: 'Segundo Año',
        },
        */
      ]);
      console.log('Seeding instituciones...');
      await institucionORM.save([
        // escuelas planilla clinica
        { nombre: 'Esc. N°294', tipo: 'Primario' },
        { nombre: 'Jardin N° 118', tipo: 'Jardin' },
        { nombre: 'Jardín N° 49', tipo: 'Jardin' },
        { nombre: 'CEM N° 147', tipo: 'Secundario' },
        { nombre: 'CI Municipal N°3', tipo: 'Primario' },
        { nombre: 'Otros', tipo: 'Primario' },
      ]);
    } catch (error) {
      console.error('Error durante la ejecución de los seeders:', error);
    }
  }
}

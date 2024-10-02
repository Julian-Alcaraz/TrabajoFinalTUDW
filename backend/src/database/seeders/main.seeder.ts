import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/es';
import { DataSource } from 'typeorm';

import { Menu } from '../../menu/entities/menu.entity';
import { Rol } from '../../rol/entities/rol.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { codificarContrasenia } from '../../common/utils/bcrypt';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    try {
      // Repositories
      const rolORM = dataSource.getRepository(Rol);
      const usuarioORM = dataSource.getRepository(Usuario);
      const menuORM = dataSource.getRepository(Menu);
      // Factories
      const usuarioFactory = factoryManager.get(Usuario);

      // Roles # 1
      console.log('Seeding roles...');
      const roles = await rolORM.save([
        {
          nombre: 'Administrador',
        },
        {
          nombre: 'Medico',
        },
        {
          nombre: 'rolDeshabilitado',
          deshabilitado: true,
        },
      ]);

      // Usuarios
      console.log('Seeding usuarios...');
      const usuariosPredeterminados = await usuarioORM.save([
        {
          nombre: 'Admin',
          apellido: 'Admin',
          email: 'Admin@Admin.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 12345678,
          fe_nacimiento: '2000-12-30',
          roles: [roles[0]], // Admin
        },
        {
          nombre: 'Medico',
          apellido: 'Medico',
          email: 'Medico@Medico.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 12345679,
          fe_nacimiento: '2000-12-30',
          roles: [roles[1]], // Medico
        },
        {
          nombre: 'MedicoYAdmin',
          apellido: 'MedicoYAdmin',
          email: 'MedicoYAdmin@MedicoYAdmin.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 12345670,
          fe_nacimiento: '2000-12-30',
          roles: [roles[0], roles[1]], // MedicoYAdmin
        },
        {
          nombre: 'usuarioDeshabilitado',
          apellido: 'usuarioDeshabilitado',
          email: 'deshabilitado@deshabilitado.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 10345670,
          fe_nacimiento: '2000-12-30',
          roles: [roles[0], roles[1]], // MedicoYAdmin
          deshabilitado: true,
        },
      ]);
      // Crea 10 usuarios con 1 rol cada uno, puede ser medico o administrador pero no ambos
      const usuarios = await Promise.all(
        Array(5)
          .fill('')
          .map(async () => {
            const usuario = await usuarioFactory.make({
              roles: [faker.helpers.arrayElement(roles)],
            });
            return usuario;
          }),
      );
      // Crea 3 usuarios con 2 roles cada uno
      const usuarios2 = await Promise.all(
        Array(2)
          .fill('')
          .map(async () => {
            const usuario = await usuarioFactory.make({
              roles: [roles[0], roles[1]],
            });
            return usuario;
          }),
      );
      await usuarioORM.save(usuariosPredeterminados);
      await usuarioORM.save(usuarios);
      await usuarioORM.save(usuarios2);

      // Menus
      // Menus que tienen hijos
      console.log('Seeding menus...');
      const menus = await menuORM.save([
        {
          url: 'dashboard',
          label: 'Dashboard',
          orden: 1,
          icon: 'fa-solid fa-chart-line',
          roles: [roles[0], roles[1]],
        },
        {
          url: 'usuarios',
          label: 'Usuarios',
          orden: 2,
          icon: 'fa-solid fa-users',
          roles: [roles[0], roles[1]],
        },
        {
          url: 'menuDeshabilitado',
          label: 'menuDeshabilitado',
          orden: 0,
          icon: 'menuDeshabilitado',
          roles: [roles[0], roles[1], roles[2]],
          deshabilitado: true,
        },
      ]);
      await menuORM.save(menus);
      // Menus que tienen padres
      const menus2 = await menuORM.save([
        {
          url: 'usuarios/miUsuario',
          label: 'Mi Usuario',
          orden: 3,
          icon: 'fa-regular fa-user',
          roles: [roles[0], roles[1]],
          menu_padre: await menuORM.findOneBy({ id: 2 }),
        },
        {
          url: 'usuarios/nuevo',
          label: 'Nuevo Usuario',
          orden: 4,
          icon: 'fa-solid  fa-user-plus',
          roles: [roles[0]],
          menu_padre: await menuORM.findOneBy({ id: 2 }),
        },
        {
          url: 'usuarios/list',
          label: 'Lista Usuarios',
          orden: 5,
          icon: 'fa-solid fa-users-line',
          roles: [roles[0]],
          menu_padre: await menuORM.findOneBy({ id: 2 }),
        },
        {
          url: 'hijoDeshabilitado',
          label: 'hijoDeshabilitado',
          orden: 0,
          icon: 'hijoDeshabilitado',
          roles: [roles[0], roles[1]],
          deshabilitado: true,
          menu_padre: await menuORM.findOneBy({ id: 1 }),
        },
      ]);
      await menuORM.save(menus2);
    } catch (error) {
      console.error('Error durante la ejecución de los seeders:', error);
    }
  }
}

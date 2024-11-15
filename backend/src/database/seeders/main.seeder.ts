import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/es';
import { DataSource } from 'typeorm';

import { Menu } from '../../menu/entities/menu.entity';
import { Rol } from '../../rol/entities/rol.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { codificarContrasenia } from '../../common/utils/bcrypt';
import { Localidad } from '../../localidad/entities/localidad.entity';
import { Barrio } from '../..//barrio/entities/barrio.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { Chico } from '../../chico/entities/chico.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';
import { Clinica } from '../../consulta/entities/clinica.entity';
import { Oftalmologia } from '../../consulta/entities/oftalmologia.entity';
import { Odontologia } from '../../consulta/entities/odontologia.entity';
import { Fonoaudiologia } from '../../consulta/entities/fonoaudiologia.entity';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    try {
      // Repositories
      const rolORM = dataSource.getRepository(Rol);
      const usuarioORM = dataSource.getRepository(Usuario);
      const menuORM = dataSource.getRepository(Menu);
      const localidadORM = dataSource.getRepository(Localidad);
      const barrioORM = dataSource.getRepository(Barrio);
      const cursoORM = dataSource.getRepository(Curso);
      const institucionORM = dataSource.getRepository(Institucion);
      const chicoORM = dataSource.getRepository(Chico);
      const consultaORM = dataSource.getRepository(Consulta);
      const clinicaORM = dataSource.getRepository(Clinica);
      const oftalmologiaORM = dataSource.getRepository(Oftalmologia);
      const odontologiaORM = dataSource.getRepository(Odontologia);
      const fonoaudiologiaORM = dataSource.getRepository(Fonoaudiologia);

      // enums

      // Factories
      const usuarioFactory = factoryManager.get(Usuario);
      const chicoFactory = factoryManager.get(Chico);
      const consultaFactory = factoryManager.get(Consulta);
      const FonoaudiologiaFactory = factoryManager.get(Fonoaudiologia);
      const ClinicaFactory = factoryManager.get(Clinica);
      const OftalmologiaFactory = factoryManager.get(Oftalmologia);
      const OdontologiaFactory = factoryManager.get(Odontologia);

      // Roles
      console.log('Seeding roles...');
      const roles = await rolORM.save([
        {
          nombre: 'Administrador',
        },
        {
          nombre: 'Profesional',
        },
        {
          nombre: 'Acceso informacion',
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
          nombre: 'Profesional',
          apellido: 'Profesional',
          email: 'Profesional@Profesional.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 12345679,
          fe_nacimiento: '2000-12-30',
          roles: [roles[1]], // Profesional
        },
        {
          nombre: 'AccesoInfo',
          apellido: 'AccesoInfo',
          email: 'AccesoInfo@AccesoInfo.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 12345671,
          fe_nacimiento: '2000-12-30',
          roles: [roles[3]], // Profesional
        },
        {
          nombre: 'ProfesionalYAdmin',
          apellido: 'ProfesionalYAdmin',
          email: 'ProfesionalYAdmin@ProfesionalYAdmin.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 12345670,
          fe_nacimiento: '2000-12-30',
          roles: [roles[0], roles[1]], // ProfesionalYAdmin
        },
        {
          nombre: 'usuarioDeshabilitado',
          apellido: 'usuarioDeshabilitado',
          email: 'deshabilitado@deshabilitado.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 10345670,
          fe_nacimiento: '2000-12-30',
          roles: [roles[0], roles[1]], // ProfesionalYAdmin
          deshabilitado: true,
        },
      ]);

      // Crea 50 usuarios con 1 rol cada uno, puede ser profesional o administrador pero no ambos
      const usuarios = await Promise.all(
        Array(50)
          .fill('')
          .map(async () => {
            const usuario = await usuarioFactory.make({
              roles: [faker.helpers.arrayElement(roles)],
            });
            return usuario;
          }),
      );
      // Crea 40 usuarios con 2 roles cada uno
      const usuariosCon2Roles = await Promise.all(
        Array(40)
          .fill('')
          .map(async () => {
            const usuario = await usuarioFactory.make({
              roles: [roles[0], roles[1]],
            });
            return usuario;
          }),
      );
      // await usuarioORM.save(usuariosPredeterminados);
      await usuarioORM.save(usuarios);
      await usuarioORM.save(usuariosCon2Roles);

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
          orden: 5,
          icon: 'fa-solid fa-users',
          roles: [roles[0], roles[1]],
        },
        {
          url: 'chicos',
          label: 'Chicos',
          orden: 3,
          icon: 'fas fa-child',
          roles: [roles[0], roles[1]],
        },
        {
          url: 'consultas',
          label: 'Consultas',
          orden: 4,
          icon: 'fa-solid fa-kit-medical',
          roles: [roles[0], roles[1]],
        },
        {
          url: 'busqueda',
          label: 'Buscar',
          orden: 2,
          icon: 'fa-solid fa-magnifying-glass',
          roles: [roles[0], roles[1], roles[2]],
          deshabilitado: false,
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
          roles: [roles[0], roles[1], roles[2], roles[3]],
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
          url: 'chicos/nuevo',
          label: 'Nuevo Chico',
          orden: 6,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: await menuORM.findOneBy({ id: 3 }),
        },
        {
          url: 'chicos/list',
          label: 'Lista Chicos',
          orden: 7,
          icon: 'fa-solid fa-list-ol',
          roles: [roles[0], roles[1], roles[2]],
          menu_padre: await menuORM.findOneBy({ id: 3 }),
        },
        {
          url: 'chicos/:id',
          label: 'Ver Chico',
          orden: 4,
          icon: '',
          roles: [roles[0], roles[1], roles[2]],
          menu_padre: await menuORM.findOneBy({ id: 3 }),
          deshabilitado: true,
        },
        {
          url: 'chicos/:id/editar',
          label: 'Editar Chico',
          orden: 4,
          icon: '',
          roles: [roles[0], roles[1], roles[2]],
          menu_padre: await menuORM.findOneBy({ id: 3 }),
          deshabilitado: true,
        },
        {
          url: 'consultas/clinica/nueva',
          label: 'Clinica',
          orden: 4,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: await menuORM.findOneBy({ id: 4 }),
        },
        {
          url: 'consultas/odontologia/nueva',
          label: 'Odontologica',
          orden: 4,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: await menuORM.findOneBy({ id: 4 }),
        },
        {
          url: 'consultas/oftalmologia/nueva',
          label: 'Oftalmologica',
          orden: 4,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: await menuORM.findOneBy({ id: 4 }),
        },
        {
          url: 'consultas/fonoaudiologia/nueva',
          label: 'Fonoaudiologica',
          orden: 4,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: await menuORM.findOneBy({ id: 4 }),
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
      // Localidades
      console.log('Seeding localidades...');
      const localidades = await localidadORM.save([
        {
          nombre: 'Neuquen',
        },
        {
          nombre: 'Cipolleti',
        },
      ]);
      console.log('Seeding barrios...');
      const barrios = await barrioORM.save([
        {
          nombre: 'El Treinta',
          localidad: localidades[0],
        },
        {
          nombre: 'La Lor',
          localidad: localidades[0],
        },
        {
          nombre: 'María Elvira',
          localidad: localidades[0],
        },
        {
          nombre: 'Puente 83',
          localidad: localidades[0],
        },
        {
          nombre: 'Norte (Río Negro)',
          localidad: localidades[0],
        },
        {
          nombre: 'Puente de Madera',
          localidad: localidades[0],
        },
        {
          nombre: 'Localidad Cipolletti',
          localidad: localidades[1],
        },
      ]);
      console.log('Seeding cursos...');
      const cursos = await cursoORM.save([
        {
          grado: 1,
          nivel: 'Primaria',
          nombre: 'Primer Grado',
        },
        {
          grado: 2,
          nivel: 'Primaria',
          nombre: 'Segundo Grado',
        },
        {
          grado: 3,
          nivel: 'Primaria',
          nombre: 'Tercer Grado',
        },
        {
          grado: 4,
          nivel: 'Primaria',
          nombre: 'Cuarto Grado',
        },
        {
          grado: 5,
          nivel: 'Primaria',
          nombre: 'Quinto Grado',
        },
        {
          grado: 6,
          nivel: 'Primaria',
          nombre: 'Sexto Grado',
        },
        {
          grado: 7,
          nivel: 'Primaria',
          nombre: 'Septimo Grado',
        },
        {
          grado: 1,
          nivel: 'Secundario',
          nombre: 'Primer Año',
        },
        {
          grado: 2,
          nivel: 'Secundario',
          nombre: 'Segundo Año',
        },
        {
          grado: 3,
          nivel: 'Secundario',
          nombre: 'Tercer Año',
        },
        {
          grado: 4,
          nivel: 'Secundario',
          nombre: 'Cuarto Año',
        },
        {
          grado: 5,
          nivel: 'Secundario',
          nombre: 'Quinto Año',
        },
        {
          grado: 6,
          nivel: 'Secundario',
          nombre: 'Sexto Año',
        },
        {
          grado: 3,
          nivel: 'Jardin',
          nombre: 'Sala de 3 Años',
        },
        {
          grado: 4,
          nivel: 'Jardin',
          nombre: 'Sala de 4 Años',
        },
        {
          grado: 5,
          nivel: 'Jardin',
          nombre: 'Sala de 5 Años',
        },
      ]);
      console.log('Seeding instituciones...');
      const instituciones = await institucionORM.save([
        {
          nombre: 'Jardin N° 14',
          tipo: 'Jardin',
        },
        {
          nombre: 'Escuela N° 125',
          tipo: 'Primario',
        },
        {
          nombre: 'E.P.E.T N° 20',
          tipo: 'Secundario',
        },
        {
          nombre: 'Universidad nacional del comahue',
          tipo: 'Terciario',
        },
      ]);
      // Chicos
      console.log('Seeding chicos...');

      // Crea 500 chicos
      const chicos = await Promise.all(
        Array(500)
          .fill('')
          .map(async () => {
            const chico = await chicoFactory.make({
              barrio: faker.helpers.arrayElement(barrios),
            });
            return chico;
          }),
      );
      await chicoORM.save(chicos);
      const chicosPredeterminados = await chicoORM.save([
        {
          dni: 12345678,
          nombre: 'Juan',
          apellido: 'Pérez',
          sexo: 'Masculino',
          fe_nacimiento: '2010-05-12',
          direccion: 'Calle Falsa 123',
          telefono: '123456789',
          nombre_madre: 'María López',
          nombre_padre: 'Carlos Pérez',
          barrio: barrios[0],
        },
        {
          dni: 11111111,
          nombre: 'Martina',
          apellido: 'Pérez',
          sexo: 'Femenino',
          fe_nacimiento: '2010-05-12',
          direccion: 'Calle Falsa 123',
          telefono: '123456789',
          nombre_madre: 'María López',
          nombre_padre: 'Carlos Pérez',
          barrio: barrios[0],
        },
        {
          dni: 2222222,
          nombre: 'Jose',
          apellido: 'Pérez',
          sexo: 'Masculino',
          fe_nacimiento: '2010-05-12',
          direccion: 'Calle Falsa 123',
          telefono: '123456789',
          nombre_madre: 'María López',
          nombre_padre: 'Carlos Pérez',
          barrio: barrios[1],
        },
        {
          dni: 12345679,
          nombre: 'Deshabilitado',
          apellido: 'Deshabilitado',
          sexo: 'Masculino',
          fe_nacimiento: '9999-05-12',
          direccion: 'Deshabilitado',
          telefono: '123456789',
          nombre_madre: 'Deshabilitado',
          nombre_padre: 'Deshabilitado',
          barrio: barrios[0],
          deshabilitado: true,
        },
      ]);

      // Busco usuarios profesionales
      const todosLosUsuarios = await usuarioORM.find({ where: { deshabilitado: false }, relations: ['roles'] });
      const usuariosProfesionales = [];
      for (const usuario of todosLosUsuarios) {
        for (const rol of usuario.roles) {
          const nombre = rol.nombre;
          if (nombre === 'Profesional') {1
            usuariosProfesionales.push(usuario);
          }
        }
      }

      // Consultas
      // Crea 1500 consultas
      console.log('Seeding consultas...');
      const consultasSimples = await Promise.all(
        Array(1500)
          .fill('')
          .map(async () => {
            const chicoSeleccionado = faker.helpers.arrayElement(chicos);
            const usuarioConRol = faker.helpers.arrayElement(usuariosProfesionales);
            const fechaNacimiento = chicoSeleccionado.fe_nacimiento;
            const edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
            const consulta = await consultaFactory.make({
              curso: faker.helpers.arrayElement(cursos),
              institucion: faker.helpers.arrayElement(instituciones),
              chico: chicoSeleccionado,
              usuario: usuarioConRol,
              edad: edad,
            });
            return consulta;
          }),
      );

      await consultaORM.save(consultasSimples);

      for (const consulta of consultasSimples) {
        switch (consulta.type) {
          case 'Clinica':
            const clinica = await ClinicaFactory.make({
              consulta: consulta,
            });
            await clinicaORM.save(clinica);
            break;
          case 'Fonoaudiologia':
            const fonoaudiologia = await FonoaudiologiaFactory.make({
              consulta: consulta,
            });
            await fonoaudiologiaORM.save(fonoaudiologia);
            break;
          case 'Oftalmologia':
            const oftalmologia = await OftalmologiaFactory.make({
              consulta: consulta,
            });
            await oftalmologiaORM.save(oftalmologia);
            break;
          case 'Odontologia':
            const odontologia = await OdontologiaFactory.make({
              consulta: consulta,
            });
            await odontologiaORM.save(odontologia);
            break;
          default:
            throw new Error(`Tipo de consulta desconocido: ${consulta.type}`);
        }
      }
    } catch (error) {
      console.error('Error durante la ejecución de los seeders:', error);
    }
  }
}

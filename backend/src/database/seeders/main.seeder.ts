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
      // enums

      // Factories
      const usuarioFactory = factoryManager.get(Usuario);

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
      // Crea 10 usuarios con 1 rol cada uno, puede ser profesional o administrador pero no ambos
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
      console.log('Seeding Chicos...');
      const chicos = await chicoORM.save([
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
      // Consultas
      console.log('Seeding consultas clinicas...');
      const consultasClinicas = await consultaORM.save([
        {
          type: 'Clinica',
          edad: 14,
          usuario: usuarios[0],
          chico: chicos[0],
          curso: cursos[13],
          institucion: instituciones[0],
          turno: 'Mañana',
          clinica: {
            alimentacion: 'Buena',
            antecedentes_perinatal: true,
            cc: 30,
            consumo_alcohol: false,
            consumo_drogas: false,
            diabetes: false,
            edad: 14,
            enfermedades_previas: false,
            examen_visual: 'normal',
            hidratacion: 'Buena',
            horas_juego_airelibre: '03:00',
            horas_pantalla: '01:00',
            horas_suenio: '09:00',
            hta: false,
            infusiones: true,
            lacteos: true,
            lenguaje: 'adecuado',
            numero_comidas: 3,
            obesidad: false,
            ortopedia_traumatologia: 'normal',
            pcimc: 8.3,
            pct: 8.1,
            pcta: 6.4,
            peso: 45,
            proyecto: 'Control Niño Sano',
            segto: false,
            tad: 120,
            talla: 150,
            tas: 70,
            vacunas: 'Completo',
          },
        },
      ]);
      console.log('Seeding consultas oftalmologicas...');
      const consultasOftalmologicas = await consultaORM.save([
        {
          type: 'Oftalmologia',
          edad: 14,
          usuario: usuarios[0],
          chico: chicos[0],
          curso: cursos[13],
          institucion: instituciones[0],
          turno: 'Tarde',
          oftalmologia: {
            obra_social: 'Osde',
            anteojos: false,
            control: false,
            demanda: 'Miopia',
            primera_vez: true,
            prox_control: '2024-11-30',
            receta: true,
          },
        },
      ]);
      console.log('Seeding consultas odontologicas...');
      const consultasOdontologicas = await consultaORM.save([
        {
          type: 'Odontologia',
          edad: 14,
          usuario: usuarios[0],
          chico: chicos[0],
          curso: cursos[13],
          institucion: instituciones[0],
          turno: 'Tarde',
          odontologia: {
            cepillado: true,
            cepillo: true,
            derivacion: false,
            dientes_norecuperables: 6,
            dientes_permanentes: 3,
            dientes_recuperables: 5,
            dientes_temporales: 10,
            sellador: 9,
            habitos: 'Cepillado constante',
            primera_vez: false,
            situacion_bucal: 'Buena',
            topificacion: false,
            ulterior: true,
          },
        },
      ]);
      console.log('Seeding consultas fonoaudiologicas...');
      const consultasFonoaudiologicas = await consultaORM.save([
        {
          type: 'Fonoaudiologia',
          edad: 14,
          usuario: usuarios[0],
          chico: chicos[0],
          curso: cursos[13],
          institucion: instituciones[0],
          turno: 'Mañana',
          fonoaudiologia: {
            diagnosticoPresuntivo: 'Dificultades de comprensión auditiva',
            causas: 'Factores genéticos',
            asistencia: true,
          },
        },
        {
          type: 'Fonoaudiologia',
          edad: 1444444444,
          usuario: usuarios[0],
          chico: chicos[0],
          curso: cursos[13],
          institucion: instituciones[0],
          turno: 'Mañana',
          fonoaudiologia: {
            diagnosticoPresuntivo: 'Consulta deshabilitada',
            causas: 'Consulta deshabilitada',
            asistencia: true,
          },
          deshabilitado: true,
          created_at: '9999-12-31',
        },
      ]);
    } catch (error) {
      console.error('Error durante la ejecución de los seeders:', error);
    }
  }
}

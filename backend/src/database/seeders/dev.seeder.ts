import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/es';
import { DataSource } from 'typeorm';

import { Menu } from '../../menu/entities/menu.entity';
import { Rol } from '../../rol/entities/rol.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { codificarContrasenia } from '../../common/utils/bcrypt';
import { Localidad } from '../../localidad/entities/localidad.entity';
import { Barrio } from '../../barrio/entities/barrio.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { Chico } from '../../chico/entities/chico.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';
import { Clinica } from '../../consulta/entities/clinica.entity';
import { Oftalmologia } from '../../consulta/entities/oftalmologia.entity';
import { Odontologia } from '../../consulta/entities/odontologia.entity';
import { Fonoaudiologia } from '../../consulta/entities/fonoaudiologia.entity';
import { Especialidad } from '../../especialidad/entities/especialidad.entity';
import { Marco } from '../../marco/entities/marco.entity';
import { Taller } from '../../taller/entities/taller.entity';
import { Social } from '../../consulta/entities/social.entity';
import { Prevencion } from '../../consulta/entities/prevencion.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';

export class DevSeeder implements Seeder {
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
      const especialidadORM = dataSource.getRepository(Especialidad);
      const marcoORM = dataSource.getRepository(Marco);
      const tallerORM = dataSource.getRepository(Taller);
      const socialOrm = dataSource.getRepository(Social);
      const prevencionOrm = dataSource.getRepository(Prevencion);
      const categoriaORM = dataSource.getRepository(Categoria);

      // Factories
      const usuarioFactory = factoryManager.get(Usuario);
      const chicoFactory = factoryManager.get(Chico);
      const consultaFactory = factoryManager.get(Consulta);
      const FonoaudiologiaFactory = factoryManager.get(Fonoaudiologia);
      const ClinicaFactory = factoryManager.get(Clinica);
      const OftalmologiaFactory = factoryManager.get(Oftalmologia);
      const OdontologiaFactory = factoryManager.get(Odontologia);
      const tallerFactory = factoryManager.get(Taller);
      const SocialFactory = factoryManager.get(Social);
      const PrevencionFactory = factoryManager.get(Prevencion);

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
          nombre: 'Acceso Info',
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
          roles: [roles[2]], // AccesoInfo
        },
        {
          nombre: 'usuarioDeshabilitado',
          apellido: 'usuarioDeshabilitado',
          email: 'deshabilitado@deshabilitado.com',
          contrasenia: codificarContrasenia('1234567'),
          dni: 10345670,
          fe_nacimiento: '2000-12-30',
          roles: [roles[0]], // ProfesionalYAdmin
          deshabilitado: true,
        },
        {
          nombre: 'Julian',
          apellido: 'Alcaraz',
          email: 'julianalcaraz4@gmail.com',
          contrasenia: codificarContrasenia('44671915'),
          dni: 44671915,
          fe_nacimiento: '2003-02-09',
          roles: [roles[0]], // admin
        },
        {
          nombre: 'Jorge',
          apellido: 'Rodriguez',
          email: 'jorgeRodriguez@gmail.com',
          contrasenia: codificarContrasenia('12345674'),
          dni: 12345674,
          fe_nacimiento: '2000-01-01',
          roles: [roles[0]], // admin
        },
        {
          nombre: 'Lucas',
          apellido: 'Puyol',
          email: 'lucasPujol@gmail.com',
          contrasenia: codificarContrasenia('12345672'),
          dni: 12345672,
          fe_nacimiento: '2000-01-01',
          roles: [roles[0]], // admin
        },
        {
          nombre: 'Fernando',
          apellido: 'Lascano',
          email: 'fernandoLascano@gmail.com',
          contrasenia: codificarContrasenia('12345673'),
          dni: 12345673,
          fe_nacimiento: '2000-01-01',
          roles: [roles[0]], // admin
        },
      ]);

      // Crea 50 usuarios con 1 rol cada uno, puede ser profesional o administrador pero no ambos
      const usuarios = await Promise.all(
        Array(50)
          .fill('')
          .map(async () => {
            const usuario = await usuarioFactory.make({
              roles: [roles[faker.number.int({ min: 0, max: 2 })]], // Selecciona un rol aleatorio dentro del rango 0-2
            });
            return usuario;
          }),
      );

      await usuarioORM.save(usuarios);

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
          url: 'talleres',
          label: 'Talleres',
          orden: 5,
          icon: 'fa-solid fa-person-chalkboard',
          roles: [roles[0], roles[1], roles[2]],
        },
        {
          url: 'administracion',
          label: 'Administración',
          orden: 6,
          icon: 'fa-solid fa-shield',
          roles: [roles[0]],
        },
        {
          url: 'miUsuario',
          label: 'Mi Usuario',
          orden: 7,
          icon: 'fa-solid fa-user',
          roles: [roles[0], roles[1], roles[2]],
          deshabilitado: true,
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

      const menusAdmin = await menuORM.save([
        {
          url: 'administracion/usuarios',
          label: 'Usuarios',
          orden: 8,
          icon: 'fa-solid fa-users',
          roles: [roles[0]],
          menu_padre: menus[4],
        },
        {
          url: 'administracion/instituciones',
          label: 'Instituciones',
          orden: 9,
          icon: 'fa-solid fa-school',
          roles: [roles[0]],
          menu_padre: menus[4],
        },
        {
          url: 'administracion/cursos',
          label: 'Cursos',
          orden: 10,
          icon: 'fa-solid fa-graduation-cap',
          roles: [roles[0]],
          menu_padre: menus[4],
        },
        {
          url: 'administracion/localidades',
          label: 'Localidades',
          orden: 11,
          icon: 'fa-solid fa-earth-americas',
          roles: [roles[0]],
          menu_padre: menus[4],
        },
        {
          url: 'administracion/barrios',
          label: 'Barrios',
          orden: 12,
          icon: 'fa-solid fa-location-dot',
          roles: [roles[0]],
          menu_padre: menus[4],
        },
        {
          url: 'administracion/datos',
          label: 'Datos',
          orden: 13,
          icon: 'fa-solid fa-file-import',
          roles: [roles[0]],
          menu_padre: menus[4],
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
          url: 'talleres/nuevo',
          label: 'Nuevo',
          orden: 6,
          icon: 'fa-solid fa-plus',
          roles: [roles[0], roles[1]],
          menu_padre: menus[3],
        },
        {
          url: 'talleres/list',
          label: 'Lista',
          orden: 7,
          icon: 'fa-solid fa-list-ol',
          roles: [roles[0], roles[1], roles[2]],
          menu_padre: menus[3],
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
        {
          url: 'hijoDeshabilitado',
          label: 'hijoDeshabilitado',
          orden: 0,
          icon: 'hijoDeshabilitado',
          roles: [roles[0], roles[1]],
          deshabilitado: true,
          menu_padre: menus[0],
        },
      ]);
      await menuORM.save(menus2);

      // Localidades
      console.log('Seeding localidades...');
      const localidades = await localidadORM.save([
        //
        { nombre: 'Neuquén' },
        { nombre: 'Cipolletti' },
        { nombre: 'Buenos Aires' },
        { nombre: 'Misiones' },
      ]);
      const neuquen = localidades[0];
      const cipolletti = localidades[1];
      const buenosAires = localidades[2];
      const misiones = localidades[3];
      console.log('Seeding barrios...');
      const barrios = await barrioORM.save([
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
      const cursos = await cursoORM.save([
        {
          nivel: 'Jardin',
          nombre: 'Sala de 3 Años',
        },
        {
          nivel: 'Jardin',
          nombre: 'Sala de 4 Años',
        },
        {
          nivel: 'Jardin',
          nombre: 'Sala de 5 Años',
        },
        {
          nivel: 'Primario',
          nombre: 'Primer Grado',
        },
        {
          nivel: 'Primario',
          nombre: 'Segundo Grado',
        },
        {
          nivel: 'Primario',
          nombre: 'Tercer Grado',
        },
        {
          nivel: 'Primario',
          nombre: 'Cuarto Grado',
        },
        {
          nivel: 'Primario',
          nombre: 'Quinto Grado',
        },
        {
          nivel: 'Primario',
          nombre: 'Sexto Grado',
        },
        {
          nivel: 'Primario',
          nombre: 'Septimo Grado',
        },
        {
          nivel: 'Secundario',
          nombre: 'Primer Año',
        },
        {
          nivel: 'Secundario',
          nombre: 'Segundo Año',
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
        // escuelas planilla clinica
        { nombre: 'Esc. N°294', tipo: 'Primario' },
        { nombre: 'Jardin N° 118', tipo: 'Jardin' },
        { nombre: 'Jardín N° 49', tipo: 'Jardin' },
        { nombre: 'CEM N° 147', tipo: 'Secundario' },
        { nombre: 'CI Municipal N°3', tipo: 'Primario' },
        { nombre: 'Otros', tipo: 'Primario' },
      ]);
      // Chicos
      console.log('Seeding chicos...');

      const chicos = await Promise.all(
        Array(1)
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
          dni: 22222221,
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
          if (nombre === 'Profesional') {
            1;
            usuariosProfesionales.push(usuario);
          }
        }
      }

      console.log('Seeding categorias...');
      const categoriasSocial = await categoriaORM.save([{ nombre: 'Inasistencias' }, { nombre: 'Obra Social' }, { nombre: 'Salud Publica' }, { nombre: 'Violencia' }, { nombre: 'Otros' }]);

      // Consultas
      for (let i = 0; i < 1; i++) {
        console.log('Seeding consultas...');
        const consultasSimples = await Promise.all(
          Array(2000)
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
                created_at: faker.date.between({ from: '2021-01-01T00:00:00.000Z', to: new Date().toISOString() }),
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
            case 'Prevencion':
              const prevencion = await PrevencionFactory.make({
                consulta: consulta,
              });
              await prevencionOrm.save(prevencion);
              break;
            case 'Social':
              const social = await SocialFactory.make({
                consulta: consulta,
                categorias: [categoriasSocial[1]],
                //           roles: [roles[0]], // Admin
              });
              await socialOrm.save(social);
              break;
            default:
              throw new Error(`Tipo de consulta desconocido: ${consulta.type}`);
          }
        }
      }
      // Especialidades
      console.log('Seeding especialidades...');

      const especialidades = await especialidadORM.save([{ nombre: 'Fonoaudiologia' }, { nombre: 'Clinica' }, { nombre: 'Nutricion' }, { nombre: 'Odontologia' }, { nombre: 'Prevencion' }]);

      // Marcos
      console.log('Seeding marcos...');
      const marcosFonoaudiologia = await marcoORM.save([
        { nombre: 'Prevención y promoción', especialidad: especialidades[0] },
        { nombre: 'Deteccion', especialidad: especialidades[0] },
        { nombre: 'Higiene y Salud', especialidad: especialidades[0] },
        { nombre: 'Indroducción Lectoescritura', especialidad: especialidades[0] },
      ]);

      const marcosClinica = await marcoORM.save([
        { nombre: 'Prevencion y Promoción Integral', especialidad: especialidades[1] },
        { nombre: 'Educación para la Salud', especialidad: especialidades[1] },
        { nombre: 'Promoción de Salud', especialidad: especialidades[1] },
        { nombre: 'Participación y Bienestar Infantil', especialidad: especialidades[1] },
        { nombre: 'Prevención de Enfermedades', especialidad: especialidades[1] },
      ]);

      const marcosNutricion = await marcoORM.save([
        { nombre: 'Imagen Corporal', especialidad: especialidades[2] },
        { nombre: 'Alimentación Saludable', especialidad: especialidades[2] },
        { nombre: 'Patología Alimentaria', especialidad: especialidades[2] },
        { nombre: 'Estadística', especialidad: especialidades[2] },
      ]);

      const marcosOdontologia = await marcoORM.save([
        { nombre: 'Motivación', especialidad: especialidades[3] },
        { nombre: 'Prevención de Caries', especialidad: especialidades[3] },
        { nombre: 'Prevención', especialidad: especialidades[3] },
        { nombre: 'Teórico', especialidad: especialidades[3] },
      ]);

      const marcosPrevencion = await marcoORM.save([
        { nombre: 'Identidad', especialidad: especialidades[4] },
        { nombre: 'Elecciones', especialidad: especialidades[4] },
        { nombre: 'Emociones', especialidad: especialidades[4] },
        { nombre: 'Consumos Problemáticos', especialidad: especialidades[4] },
        { nombre: 'Habilidades para la Vida', especialidad: especialidades[4] },
        { nombre: 'Día Mundial sin Tabaco', especialidad: especialidades[4] },
        { nombre: 'Día de la Lucha contra las Adicciones', especialidad: especialidades[4] },
        { nombre: 'Día Mundial sin Alcohol', especialidad: especialidades[4] },
      ]);

      console.log('Seeding talleres...');
      const batchSize = 1;
      for (let i = 0; i < 1; i += batchSize) {
        const talleres = await Promise.all(
          Array(batchSize)
            .fill('')
            .map(async () => {
              const especialidadSeleccionada = faker.helpers.arrayElement(especialidades);
              let marcoSeleccionado;
              let entregaCepillos;
              switch (especialidadSeleccionada.nombre) {
                case 'Fonoaudiologia':
                  marcoSeleccionado = faker.helpers.arrayElement(marcosFonoaudiologia);
                  entregaCepillos = null;
                  break;
                case 'Clinica':
                  marcoSeleccionado = faker.helpers.arrayElement(marcosClinica);
                  entregaCepillos = null;
                  break;
                case 'Nutricion':
                  marcoSeleccionado = faker.helpers.arrayElement(marcosNutricion);
                  entregaCepillos = null;
                  break;
                case 'Odontologia':
                  marcoSeleccionado = faker.helpers.arrayElement(marcosOdontologia);
                  entregaCepillos = faker.helpers.maybe(() => true, { probability: 0.05 }) ?? false;
                  break;
                case 'Prevencion':
                  marcoSeleccionado = faker.helpers.arrayElement(marcosPrevencion);
                  entregaCepillos = null;
                  break;
              }

              const institucionSeleccionada = faker.helpers.arrayElement(instituciones);
              const cursosFiltrados = cursos.filter((curso) => curso.nivel === institucionSeleccionada.tipo);
              const cursoSeleccionado = faker.helpers.arrayElement(cursosFiltrados);

              const taller = await tallerFactory.make({
                curso: cursoSeleccionado,
                institucion: institucionSeleccionada,
                especialidad: especialidadSeleccionada,
                marco: marcoSeleccionado,
                entrega_cepillos: entregaCepillos,
              });
              return taller;
            }),
        );
        await tallerORM.save(talleres);
      }
    } catch (error) {
      console.error('Error durante la ejecución de los seeders:', error);
    }
  }
}

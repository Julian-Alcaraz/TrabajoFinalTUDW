import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChicoDto } from './dto/create-chico.dto';
import { UpdateChicoDto } from './dto/update-chico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chico } from './entities/chico.entity';
import { Repository } from 'typeorm';
import { Barrio } from 'src/barrio/entities/barrio.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Injectable()
export class ChicoService {
  constructor(
    @InjectRepository(Chico) private readonly chicoORM: Repository<Chico>,
    @InjectRepository(Barrio) private readonly barrioORM: Repository<Barrio>,
  ) {}

  async create(createChicoDto: CreateChicoDto) {
    const chicoEncontradoDni = await this.chicoORM.findOneBy({ dni: createChicoDto.dni });
    if (chicoEncontradoDni) throw new BadRequestException(`El chico con dni ${createChicoDto.dni} ya esta cargado en el sistema`);
    const nuevoChico = this.chicoORM.create({ ...createChicoDto });
    if (createChicoDto.id_barrio) {
      // if redundante ? tiene que tener barrio si o si, en el update puede tener sentido pero en create no.
      const barrio = await this.barrioORM.findBy({ id: createChicoDto.id_barrio, deshabilitado: false });
      if (barrio.length == 0) throw new NotFoundException(`El id de barrio ingresado no existe id: ${createChicoDto.id_barrio}`);
      nuevoChico.barrio = barrio[0];
    }
    return this.chicoORM.save(nuevoChico);
  }

  findAll() {
    return this.chicoORM.find();
  }

  async findAllWithActivity(year: number) {
    const result = await this.chicoORM
      .createQueryBuilder('chico')
      .leftJoin('chico.barrio', 'barrio')
      .leftJoin('barrio.localidad', 'localidad')
      .select(['chico.id AS id', 'chico.created_at AS created_at', 'chico.updated_at AS updated_at', 'chico.deshabilitado AS deshabilitado', 'chico.dni AS dni', 'chico.nombre AS nombre', 'chico.apellido AS apellido', 'chico.sexo AS sexo', "TO_CHAR(chico.fe_nacimiento, 'DD-MM-YYYY') AS fe_nacimiento", 'chico.direccion AS direccion', 'chico.telefono AS telefono', 'chico.nombre_madre AS nombre_madre', 'chico.nombre_padre AS nombre_padre', 'chico.id_barrio AS id_barrio', 'localidad.id AS id_localidad'])
      .addSelect((subQuery) => {
        return subQuery.select('CAST(COUNT(DISTINCT consulta.type) AS INTEGER)', 'actividad').from(Consulta, 'consulta').where('consulta.id_chico = chico.id').andWhere('consulta.deshabilitado = false AND EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }, 'actividad')
      .orderBy('chico.nombre')
      .getRawMany();

    return result;
  }

  async findOne(id: number) {
    const chico = await this.chicoORM.findOne({ where: { id, deshabilitado: false }, relations: ['barrio', 'barrio.localidad'] });
    //const fe_nacimiento = new Date(chico.fe_nacimiento);
    //const fechaFormateada = [fe_nacimiento.getDate().toString().padStart(2, '0'), (fe_nacimiento.getMonth() + 1).toString().padStart(2, '0'), fe_nacimiento.getFullYear()].join('-');
    //console.log(typeof fechaFormateada);
    if (!chico) throw new NotFoundException(`Chico con id ${id} no encontrado`);
    return chico;
    //return {
    //  ...chico,
    //  fe_nacimiento: fe_nacimiento,
    //};
  }

  async findOneByDni(dni: number) {
    const chico = await this.chicoORM.findOne({ where: { dni }, relations: ['barrio', 'barrio.localidad'] });
    // if (!chico) throw new NotFoundException(`Chico con dni ${dni} no encontrado`);!!!! deberia estar descomentado creo
    return chico;
  }

  async update(id: number, updateChicoDto: UpdateChicoDto) {
    if (Object.keys(updateChicoDto).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const chico = await this.chicoORM.findOneBy({ id });
    if (!chico) throw new NotFoundException(`Chico con id ${id} no encontrado`);
    if (updateChicoDto.dni) {
      const chicoEncontradoDni = await this.chicoORM.findOneBy({ dni: updateChicoDto.dni });
      if (chicoEncontradoDni && chicoEncontradoDni.id != id) throw new BadRequestException(`El dni ${updateChicoDto.dni} ya esta cargado en el sistema`);
    }
    this.chicoORM.merge(chico, updateChicoDto);
    return this.chicoORM.save(chico);
  }

  async remove(id: number) {
    const chico = await this.chicoORM.findOneBy({ id });
    if (!chico) throw new NotFoundException(`Chico con id ${id} no encontrado`);
    else if (chico.deshabilitado) throw new BadRequestException(`El chico con id ${id} ya esta deshabilitado`);
    chico.deshabilitado = true;
    return this.chicoORM.save(chico);
  }

  async findChicosConsultas(id: number) {
    const chico = await this.chicoORM.findOne({
      where: { id },
      relations: ['consultas', 'consultas.usuario', 'consultas.institucion', 'consultas.curso'],
    });
    if (!chico) throw new NotFoundException(`Chico con id ${id} no encontrado`);
    chico.consultas = chico.consultas.filter((consulta) => consulta.deshabilitado === false);
    chico.consultas = formatearFecha(chico.consultas);
    return chico.consultas;
  }

  async countChicosUpxYear(year: number) {
    const respuesta = [];
    for (let i = 0; i < 4; i++) {
      const countChicos = await this.chicoORM.createQueryBuilder('chico').where('EXTRACT(YEAR FROM chico.created_at) = :year', { year }).getCount();
      respuesta.push(countChicos);
      year--;
    }
    return respuesta.reverse();
  }
}

function formatearFecha(results: any[]): any[] {
  const formatDate = (date: Date): string =>
    [
      date.getDate().toString().padStart(2, '0'), // Día
      (date.getMonth() + 1).toString().padStart(2, '0'), // Mes
      date.getFullYear(), // Año
    ].join('-');

  return results.map((result) => ({
    ...result,
    created_at: result.created_at ? formatDate(new Date(result.created_at)) : null,
  }));
}

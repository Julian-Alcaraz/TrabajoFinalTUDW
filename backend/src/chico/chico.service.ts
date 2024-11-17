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
  async findAllWhitActivity(year: number) {
    const result = await this.chicoORM
      .createQueryBuilder('chico')
      .select(['chico.id AS id', 'chico.created_at AS created_at', 'chico.updated_at AS updated_at', 'chico.deshabilitado AS deshabilitado', 'chico.dni AS dni', 'chico.nombre AS nombre', 'chico.apellido AS apellido', 'chico.sexo AS sexo', 'chico.fe_nacimiento AS fe_nacimiento', 'chico.direccion AS direccion', 'chico.telefono AS telefono', 'chico.nombre_madre AS nombre_madre', 'chico.nombre_padre AS nombre_padre', 'chico.id_barrio AS id_barrio'])
      .addSelect((subQuery) => {
        return subQuery.select('CAST(COUNT(DISTINCT consulta.type) AS INTEGER)', 'actividad').from(Consulta, 'consulta').where('consulta.id_chico = chico.id').andWhere('EXTRACT(YEAR FROM consulta.created_at) = :year', { year });
      }, 'actividad')
      .getRawMany();
    return result;
  }
  async findOne(id: number) {
    const chico = await this.chicoORM.findOne({ where: { id, deshabilitado: false }, relations: ['barrio', 'barrio.localidad'] });
    if (!chico) throw new NotFoundException(`Chico con id ${id} no encontrado`);
    return chico;
  }

  async findOneByDni(dni: number) {
    const chico = await this.chicoORM.findOne({ where: { dni, deshabilitado: false }, relations: ['barrio', 'barrio.localidad'] });
    // if (!chico) throw new NotFoundException(`Chico con dni ${dni} no encontrado`);
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

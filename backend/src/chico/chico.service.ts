import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChicoDto } from './dto/create-chico.dto';
import { UpdateChicoDto } from './dto/update-chico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chico } from './entities/chico.entity';
import { Repository } from 'typeorm';
import { Barrio } from 'src/barrio/entities/barrio.entity';

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
    const usuario = await this.chicoORM.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Chico con id ${id} no encontrado`);
    if (updateChicoDto.dni) {
      const chicoEncontradoDni = await this.chicoORM.findOneBy({ dni: updateChicoDto.dni });
      if (chicoEncontradoDni && chicoEncontradoDni.id != id) throw new BadRequestException(`El dni ${updateChicoDto.dni} ya esta cargado en el sistema`);
    }
    this.chicoORM.merge(usuario, updateChicoDto);
    return this.chicoORM.save(usuario);
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
}

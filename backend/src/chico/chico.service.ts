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
    if (chicoEncontradoDni) throw new BadRequestException(`El usuario con dni ${createChicoDto.dni} ya esta cargado en el sistema`);
    const nuevoChico = this.chicoORM.create({ ...createChicoDto });
    if (createChicoDto.barrio_id) {
      const barrio = await this.barrioORM.findBy({ id: createChicoDto.barrio_id, deshabilitado: false });
      if (barrio.length == 0) throw new NotFoundException(`El id  de barrio ingresado no existe id: ${createChicoDto.barrio_id}`);
      nuevoChico.barrio = barrio[0];
    }
    return this.chicoORM.save(nuevoChico);
  }

  findAll() {
    return this.chicoORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const chico = await this.chicoORM.findOne({ where: { id, deshabilitado: false }, relations: ['barrio'] });
    if (!chico) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return chico;
  }

  async update(id: number, updateChicoDto: UpdateChicoDto) {
    if (Object.keys(updateChicoDto).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const usuario = await this.chicoORM.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    if (updateChicoDto.dni) {
      const usuarioEncontradoDni = await this.chicoORM.findOneBy({ dni: updateChicoDto.dni });
      if (usuarioEncontradoDni && usuarioEncontradoDni.id != id) throw new BadRequestException(`El dni ${updateChicoDto.dni} ya esta cargado en el sistema`);
    }
    this.chicoORM.merge(usuario, updateChicoDto);
    return this.chicoORM.save(usuario);
  }

  async remove(id: number) {
    const chico = await this.chicoORM.findOneBy({ id });
    if (!chico) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    else if (chico.deshabilitado) throw new BadRequestException(`El usuario con id ${id} ya esta deshabilitado`);
    chico.deshabilitado = true;
    return this.chicoORM.save(chico);
  }
}

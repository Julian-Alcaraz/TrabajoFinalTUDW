import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Especialidad } from 'src/especialidad/entities/especialidad.entity';
import { Taller } from './entities/taller.entity';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { Curso } from 'src/curso/entities/curso.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';

@Injectable()
export class TallerService {
  constructor(
    @InjectRepository(Taller) private readonly tallerORM: Repository<Taller>,
    @InjectRepository(Especialidad) private readonly especialidadORM: Repository<Especialidad>,
    @InjectRepository(Institucion) private readonly institucionORM: Repository<Institucion>,
    @InjectRepository(Curso) private readonly cursoORM: Repository<Curso>,
  ) {}

  async create(createTallerDto: CreateTallerDto) {
    const nuevoTaller = this.tallerORM.create({ ...createTallerDto });
    // Especialidad
    const especialidad = await this.especialidadORM.findOneBy({ id: createTallerDto.id_especialidad, deshabilitado: false });
    if (!especialidad) throw new NotFoundException(`El id de la especialidad ingresada no existe id: ${createTallerDto.id_especialidad}`);
    nuevoTaller.especialidad = especialidad;
    // Institucion
    const institucion = await this.institucionORM.findOneBy({ id: createTallerDto.id_institucion, deshabilitado: false });
    if (!institucion) throw new NotFoundException(`El id de la institucion ingresada no existe id: ${createTallerDto.id_institucion}`);
    nuevoTaller.institucion = institucion;
    // Curso
    const curso = await this.cursoORM.findOneBy({ id: createTallerDto.id_curso, deshabilitado: false });
    if (!curso) throw new NotFoundException(`El id del curso ingresado no existe id: ${createTallerDto.id_curso}`);
    nuevoTaller.curso = curso;
    return this.tallerORM.save(nuevoTaller);
  }

  findAll() {
    return this.tallerORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const taller = await this.tallerORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!taller) throw new NotFoundException(`Taller con id ${id} no encontrado`);
    return taller;
  }

  async update(id: number, cambios: UpdateTallerDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const taller = await this.tallerORM.findOne({ where: { deshabilitado: false, id: id } /*, relations: ['especialidad']*/ });
    if (!taller) throw new NotFoundException(`Taller con id ${id} no encontrado`);

    // Especialidad
    const idEspecialidad = cambios.id_especialidad ? cambios.id_especialidad : null;
    let especialidadEncontrada: Especialidad | null = null;
    if (!idEspecialidad) especialidadEncontrada = null;
    else {
      especialidadEncontrada = await this.especialidadORM.findOne({ where: { id: idEspecialidad, deshabilitado: false } });
      if (!especialidadEncontrada) throw new NotFoundException(`Especialidad con id ${idEspecialidad} no encontrada`);
      if (especialidadEncontrada && taller.especialidad.id !== especialidadEncontrada.id) {
        taller.especialidad = especialidadEncontrada;
      } else {
        throw new BadRequestException(`Se envio la misma especialidad que ya tenia el taller`);
      }
    }

    // Institucion
    const idInstitucion = cambios.id_institucion ? cambios.id_institucion : null;
    let institucionEncontrada: Institucion | null = null;
    if (!idEspecialidad) institucionEncontrada = null;
    else {
      institucionEncontrada = await this.institucionORM.findOne({ where: { id: idInstitucion, deshabilitado: false } });
      if (!institucionEncontrada) throw new NotFoundException(`Institucion con id ${idInstitucion} no encontrada`);
      if (institucionEncontrada && taller.especialidad.id !== institucionEncontrada.id) {
        taller.institucion = institucionEncontrada;
      } else {
        throw new BadRequestException(`Se envio la misma especialidad que ya tenia el taller`);
      }
    }

    // Curso
    const idCurso = cambios.id_curso ? cambios.id_curso : null;
    let cursoEncontrado: Curso | null = null;
    if (!idCurso) cursoEncontrado = null;
    else {
      cursoEncontrado = await this.cursoORM.findOne({ where: { id: idCurso, deshabilitado: false } });
      if (!cursoEncontrado) throw new NotFoundException(`Curso con id ${idCurso} no encontrado`);
      if (cursoEncontrado && taller.curso.id !== cursoEncontrado.id) {
        taller.curso = cursoEncontrado;
      } else {
        throw new BadRequestException(`Se envio el mismo curso que ya tenia el taller`);
      }
    }

    this.tallerORM.merge(taller, cambios);
    return this.tallerORM.save(taller);
  }

  async remove(id: number) {
    const taller = await this.tallerORM.findOneBy({ id });
    if (!taller) throw new NotFoundException(`Taller con id ${id} no encontrado`);
    taller.deshabilitado = true;
    return this.tallerORM.save(taller);
  }
}

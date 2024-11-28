import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CursoService {
  constructor(@InjectRepository(Curso) private readonly cursoORM: Repository<Curso>) {}
  create(createCursoDto: CreateCursoDto) {
    const nuevoCurso = this.cursoORM.create({ ...createCursoDto });
    return this.cursoORM.save(nuevoCurso);
  }

  async findAll() {
    const cursos = await this.cursoORM.find({ relations: ['consultas'] });
    return cursos.map((curso) => {
      const { consultas, ...datosCursos } = curso;
      return {
        cantidadConsultas: consultas.length,
        ...datosCursos,
      };
    });
  }

  findAllHabilitados() {
    return this.cursoORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const curso = await this.cursoORM.findOne({ where: { id, deshabilitado: false } });
    if (!curso) throw new NotFoundException(`Curso con id ${id} no encontrado`);
    return curso;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    if (Object.keys(updateCursoDto).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const curso = await this.cursoORM.findOneBy({ id });
    if (!curso) throw new NotFoundException(`Curso con id ${id} no encontrado`);
    this.cursoORM.merge(curso, updateCursoDto);
    return this.cursoORM.save(curso);
  }
  async remove(id: number) {
    const curso = await this.cursoORM.findOneBy({ id });
    if (!curso) throw new NotFoundException(`Curso con id ${id} no encontrado`);
    else if (curso.deshabilitado) throw new BadRequestException(`El curso con id ${id} ya esta deshabilitado`);
    curso.deshabilitado = true;
    return this.cursoORM.save(curso);
  }
}

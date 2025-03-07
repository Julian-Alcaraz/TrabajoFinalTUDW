import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chico } from 'src/chico/entities/chico.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { Fonoaudiologia } from 'src/consulta/entities/fonoaudiologia.entity';
import { Oftalmologia } from 'src/consulta/entities/oftalmologia.entity';
import { Odontologia } from 'src/consulta/entities/odontologia.entity';
import { Clinica } from 'src/consulta/entities/clinica.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProcesamientoService {
  constructor(
    @InjectRepository(Consulta) private readonly consultaORM: Repository<Consulta>,
    @InjectRepository(Clinica) private readonly clinicaORM: Repository<Clinica>,
    @InjectRepository(Odontologia) private readonly odontologiaORM: Repository<Odontologia>,
    @InjectRepository(Oftalmologia) private readonly oftalmologiaORM: Repository<Oftalmologia>,
    @InjectRepository(Fonoaudiologia) private readonly fonoaudiologiaORM: Repository<Fonoaudiologia>,
    // chico,institucion, curso
    @InjectRepository(Institucion) private readonly institucionORM: Repository<Institucion>,
    @InjectRepository(Curso) private readonly cursoORM: Repository<Curso>,
    @InjectRepository(Chico) private readonly chicoORM: Repository<Chico>,
  ) {}
  // se va a ir
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async procesarClinica(data: object) {
    console.log(console.log(data));

    await this.delay(2900);
    return true;
  }

  async procesarOftalmologia(data: object) {
    console.log(console.log(data));
    return true;
  }

  async procesarOdontologia(data: object) {
    console.log(console.log(data));
    return true;
  }

  async procesarFonoaudiologia(data: object) {
    console.log(console.log(data));
    return true;
  }
}

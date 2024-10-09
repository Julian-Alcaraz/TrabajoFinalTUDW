import { Injectable } from '@nestjs/common';
import { CreateChicoDto } from './dto/create-chico.dto';
import { UpdateChicoDto } from './dto/update-chico.dto';

@Injectable()
export class ChicoService {
  create(createChicoDto: CreateChicoDto) {
    return 'This action adds a new chico';
  }

  findAll() {
    return `This action returns all chico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chico`;
  }

  update(id: number, updateChicoDto: UpdateChicoDto) {
    return `This action updates a #${id} chico`;
  }

  remove(id: number) {
    return `This action removes a #${id} chico`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateMarcoDto } from './dto/create-marco.dto';
import { UpdateMarcoDto } from './dto/update-marco.dto';

@Injectable()
export class MarcoService {
  create(createMarcoDto: CreateMarcoDto) {
    return 'This action adds a new marco';
  }

  findAll() {
    return `This action returns all marco`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marco`;
  }

  update(id: number, updateMarcoDto: UpdateMarcoDto) {
    return `This action updates a #${id} marco`;
  }

  remove(id: number) {
    return `This action removes a #${id} marco`;
  }
}

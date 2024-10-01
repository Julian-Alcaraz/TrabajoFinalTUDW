import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Menu } from '../../menu/entities/menu.entity';
// NO SE USA
export const MenuFactory = setSeederFactory(Menu, async () => {
  const menu = new Menu();
  menu.icon = faker.image.url();
  menu.label = faker.word.adjective();
  menu.orden = faker.number.int();
  menu.url = faker.image.url();
  return menu;
});

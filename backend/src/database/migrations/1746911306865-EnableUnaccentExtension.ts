import { MigrationInterface, QueryRunner } from 'typeorm';

//
// NO BORRAR, INSTALA EXTENSION PARA SACAR ACENTOS DE BD CUANDO SE HACE UNA CONSULTA CON QUERYBUILDER.
// SE USA PARA COMPARAR NOMBRES EN EXPORTAR XLS
//

export class EnableUnaccentExtension1746911306865 implements MigrationInterface {
  name = 'EnableUnaccentExtension1746911306865';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS unaccent`);
  }
}

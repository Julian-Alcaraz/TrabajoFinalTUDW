import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1732999752757 implements MigrationInterface {
  name = 'Migrations1732999752757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "demanda"`);
    await queryRunner.query(`CREATE TYPE "public"."oftalmologia_demanda_enum" AS ENUM('Control niño sano', 'Docente', 'Familiar', 'Otro')`);
    await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "demanda" "public"."oftalmologia_demanda_enum" NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "demanda"`);
    await queryRunner.query(`DROP TYPE "public"."oftalmologia_demanda_enum"`);
    await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "demanda" character varying(100) NOT NULL`);
  }
}

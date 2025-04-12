import { MigrationInterface, QueryRunner } from "typeorm";

export class Talleres1744494359245 implements MigrationInterface {
    name = 'Talleres1744494359245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marco" DROP CONSTRAINT "FK_368dc61563a4613f6bb5eaf9a3d"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_9fd97d12044983e0a36d41c395d"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_c3c90505bde06bc7da43a06846f"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_4c2f28abc4a289d04587ec4ddee"`);
        await queryRunner.query(`ALTER TABLE "marco" RENAME COLUMN "especialidadId" TO "id_especialidad"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "institucionId"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "cursoId"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "especialidadId"`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "id_institucion" integer`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "id_curso" integer`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "id_especialidad" integer`);
        await queryRunner.query(`ALTER TABLE "marco" ADD CONSTRAINT "FK_a134c5ab06accf12bc9eac2c4ba" FOREIGN KEY ("id_especialidad") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_aa4cc8d797808bd163dbb005553" FOREIGN KEY ("id_institucion") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_ce2c4f6f93d1e52b9fa18d1a78c" FOREIGN KEY ("id_curso") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_3e8b06d8b2dbf5ccf273e2fb51f" FOREIGN KEY ("id_especialidad") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_3e8b06d8b2dbf5ccf273e2fb51f"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_ce2c4f6f93d1e52b9fa18d1a78c"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_aa4cc8d797808bd163dbb005553"`);
        await queryRunner.query(`ALTER TABLE "marco" DROP CONSTRAINT "FK_a134c5ab06accf12bc9eac2c4ba"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "id_especialidad"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "id_curso"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "id_institucion"`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "especialidadId" integer`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "cursoId" integer`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "institucionId" integer`);
        await queryRunner.query(`ALTER TABLE "marco" RENAME COLUMN "id_especialidad" TO "especialidadId"`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_4c2f28abc4a289d04587ec4ddee" FOREIGN KEY ("institucionId") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_c3c90505bde06bc7da43a06846f" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_9fd97d12044983e0a36d41c395d" FOREIGN KEY ("especialidadId") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "marco" ADD CONSTRAINT "FK_368dc61563a4613f6bb5eaf9a3d" FOREIGN KEY ("especialidadId") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

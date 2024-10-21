import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1729481211964 implements MigrationInterface {
    name = 'Migrations1729481211964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."consulta_turno_enum" AS ENUM('Mañana', 'Tarde', 'Noche')`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "turno" "public"."consulta_turno_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "turno"`);
        await queryRunner.query(`DROP TYPE "public"."consulta_turno_enum"`);
    }

}

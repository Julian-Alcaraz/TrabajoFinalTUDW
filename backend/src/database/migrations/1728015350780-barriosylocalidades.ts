import { MigrationInterface, QueryRunner } from "typeorm";

export class Barriosylocalidades1728015350780 implements MigrationInterface {
    name = 'Barriosylocalidades1728015350780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "telefono"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "telefono" character varying(15)`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "type" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "obra_social"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "obra_social" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "consulta" ALTER COLUMN "edad" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" ALTER COLUMN "edad" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "obra_social"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "obra_social" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "telefono"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "telefono" character varying(100)`);
    }

}

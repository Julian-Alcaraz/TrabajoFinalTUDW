import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1729124195332 implements MigrationInterface {
    name = 'Migrations1729124195332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "detalleClinico"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "demanda" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "primera_vez" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "control" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "receta" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "prox_control" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "anteojos" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "anteojos"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "prox_control"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "receta"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "control"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "primera_vez"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "demanda"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "detalleClinico" character varying NOT NULL`);
    }

}

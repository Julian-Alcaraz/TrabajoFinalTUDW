import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1728573346068 implements MigrationInterface {
    name = 'Migrations1728573346068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chico" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "deshabilitado" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "deshabilitado"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "created_at"`);
    }

}

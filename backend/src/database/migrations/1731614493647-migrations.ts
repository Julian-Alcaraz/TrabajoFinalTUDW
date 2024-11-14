import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731614493647 implements MigrationInterface {
    name = 'Migrations1731614493647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "habitos"`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "habitos" character varying(1000) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "habitos"`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "habitos" character varying(100) NOT NULL`);
    }

}

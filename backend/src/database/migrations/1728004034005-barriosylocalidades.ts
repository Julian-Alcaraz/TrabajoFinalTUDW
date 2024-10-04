import { MigrationInterface, QueryRunner } from "typeorm";

export class Barriosylocalidades1728004034005 implements MigrationInterface {
    name = 'Barriosylocalidades1728004034005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" ADD "chicoDni" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_44e957c5a5a99753007cd8b9eca" FOREIGN KEY ("chicoDni") REFERENCES "chico"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_44e957c5a5a99753007cd8b9eca"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "chicoDni"`);
    }

}

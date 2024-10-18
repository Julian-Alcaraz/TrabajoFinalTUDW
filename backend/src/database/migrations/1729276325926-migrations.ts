import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1729276325926 implements MigrationInterface {
    name = 'Migrations1729276325926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "REL_36af3728d02bc72fd5b9efd3c3"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "REL_149d4fb8d7e85eb95e5ef11989"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b" FOREIGN KEY ("institucionId") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "REL_149d4fb8d7e85eb95e5ef11989" UNIQUE ("cursoId")`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "REL_36af3728d02bc72fd5b9efd3c3" UNIQUE ("institucionId")`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b" FOREIGN KEY ("institucionId") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

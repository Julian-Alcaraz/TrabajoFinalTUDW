import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebaconsultas1727976712368 implements MigrationInterface {
    name = 'Pruebaconsultas1727976712368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "PK_e78d5c2455398521e9e70b816c5"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "FK_38d5690043f749ce4c80710cafa"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ALTER COLUMN "consultaId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "PK_38d5690043f749ce4c80710cafa" PRIMARY KEY ("consultaId")`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "REL_38d5690043f749ce4c80710caf"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "oftalmologia_consultaId_seq" OWNED BY "oftalmologia"."consultaId"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ALTER COLUMN "consultaId" SET DEFAULT nextval('"oftalmologia_consultaId_seq"')`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "FK_38d5690043f749ce4c80710cafa" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "FK_38d5690043f749ce4c80710cafa"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ALTER COLUMN "consultaId" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "oftalmologia_consultaId_seq"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "REL_38d5690043f749ce4c80710caf" UNIQUE ("consultaId")`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "PK_38d5690043f749ce4c80710cafa"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ALTER COLUMN "consultaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "FK_38d5690043f749ce4c80710cafa" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "PK_e78d5c2455398521e9e70b816c5" PRIMARY KEY ("id")`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Barriosylocalidades1728007958165 implements MigrationInterface {
    name = 'Barriosylocalidades1728007958165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."institucion_tipo_enum" AS ENUM('Jardin', 'Primario', 'Secundario', 'Terciario')`);
        await queryRunner.query(`CREATE TABLE "institucion" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "tipo" "public"."institucion_tipo_enum" NOT NULL, CONSTRAINT "PK_8aa1903e37f2f82c98164b644a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curso" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "anio" integer NOT NULL, CONSTRAINT "PK_76073a915621326fb85f28ecc5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "obra_social" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "edad" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "institucionId" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "UQ_36af3728d02bc72fd5b9efd3c3b" UNIQUE ("institucionId")`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "cursoId" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "UQ_149d4fb8d7e85eb95e5ef11989a" UNIQUE ("cursoId")`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b" FOREIGN KEY ("institucionId") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "UQ_149d4fb8d7e85eb95e5ef11989a"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "cursoId"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "UQ_36af3728d02bc72fd5b9efd3c3b"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "institucionId"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "edad"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "obra_social"`);
        await queryRunner.query(`DROP TABLE "curso"`);
        await queryRunner.query(`DROP TABLE "institucion"`);
        await queryRunner.query(`DROP TYPE "public"."institucion_tipo_enum"`);
    }

}

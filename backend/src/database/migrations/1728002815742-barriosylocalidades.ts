import { MigrationInterface, QueryRunner } from "typeorm";

export class Barriosylocalidades1728002815742 implements MigrationInterface {
    name = 'Barriosylocalidades1728002815742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "barrio" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "localidadId" integer, CONSTRAINT "PK_0b41150a0a8470cf8fbc3609310" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "localidad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_e76c026cd7c5842719b7a3901ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "barrioId" integer`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "apellido"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "apellido" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "sexo"`);
        await queryRunner.query(`CREATE TYPE "public"."chico_sexo_enum" AS ENUM('Femenino', 'Masculino', 'Otro')`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "sexo" "public"."chico_sexo_enum"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "fe_nacimiento"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "fe_nacimiento" date`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "direccion"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "direccion" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "telefono"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "telefono" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre_madre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre_madre" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre_padre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre_padre" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "FK_37cf1e215610b0f1c6518ac146c" FOREIGN KEY ("barrioId") REFERENCES "barrio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "barrio" ADD CONSTRAINT "FK_c2a50dd2aa652807e0aa9410233" FOREIGN KEY ("localidadId") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barrio" DROP CONSTRAINT "FK_c2a50dd2aa652807e0aa9410233"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "FK_37cf1e215610b0f1c6518ac146c"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre_padre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre_padre" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre_madre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre_madre" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "telefono"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "telefono" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "direccion"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "direccion" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "fe_nacimiento"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "fe_nacimiento" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "sexo"`);
        await queryRunner.query(`DROP TYPE "public"."chico_sexo_enum"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "sexo" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "apellido"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "apellido" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "barrioId"`);
        await queryRunner.query(`DROP TABLE "localidad"`);
        await queryRunner.query(`DROP TABLE "barrio"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Tablas1728042943995 implements MigrationInterface {
    name = 'Tablas1728042943995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "localidad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_e76c026cd7c5842719b7a3901ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barrio" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "localidadId" integer, CONSTRAINT "PK_0b41150a0a8470cf8fbc3609310" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."institucion_tipo_enum" AS ENUM('Jardin', 'Primario', 'Secundario', 'Terciario')`);
        await queryRunner.query(`CREATE TABLE "institucion" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "tipo" "public"."institucion_tipo_enum" NOT NULL, CONSTRAINT "PK_8aa1903e37f2f82c98164b644a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curso" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "anio" integer NOT NULL, CONSTRAINT "PK_76073a915621326fb85f28ecc5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "barrioId" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "obra_social" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "edad" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "chicoDni" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "institucionId" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "UQ_36af3728d02bc72fd5b9efd3c3b" UNIQUE ("institucionId")`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "cursoId" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "UQ_149d4fb8d7e85eb95e5ef11989a" UNIQUE ("cursoId")`);
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
        await queryRunner.query(`ALTER TABLE "chico" ADD "telefono" character varying(15)`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre_madre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre_madre" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "nombre_padre"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "nombre_padre" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "type" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "barrio" ADD CONSTRAINT "FK_c2a50dd2aa652807e0aa9410233" FOREIGN KEY ("localidadId") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "FK_37cf1e215610b0f1c6518ac146c" FOREIGN KEY ("barrioId") REFERENCES "barrio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_44e957c5a5a99753007cd8b9eca" FOREIGN KEY ("chicoDni") REFERENCES "chico"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b" FOREIGN KEY ("institucionId") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_44e957c5a5a99753007cd8b9eca"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "FK_37cf1e215610b0f1c6518ac146c"`);
        await queryRunner.query(`ALTER TABLE "barrio" DROP CONSTRAINT "FK_c2a50dd2aa652807e0aa9410233"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "type" character varying NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "UQ_149d4fb8d7e85eb95e5ef11989a"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "cursoId"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "UQ_36af3728d02bc72fd5b9efd3c3b"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "institucionId"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "chicoDni"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "edad"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "obra_social"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "barrioId"`);
        await queryRunner.query(`DROP TABLE "curso"`);
        await queryRunner.query(`DROP TABLE "institucion"`);
        await queryRunner.query(`DROP TYPE "public"."institucion_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "barrio"`);
        await queryRunner.query(`DROP TABLE "localidad"`);
    }

}

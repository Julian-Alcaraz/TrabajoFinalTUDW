import { MigrationInterface, QueryRunner } from "typeorm";

export class Prueba1747755002464 implements MigrationInterface {
    name = 'Prueba1747755002464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categoria" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(50) NOT NULL, CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categoria-social" ("id_consulta" integer NOT NULL, "id_categoria" integer NOT NULL, CONSTRAINT "PK_32daa0db49c11dc5d1345bcce7c" PRIMARY KEY ("id_consulta", "id_categoria"))`);
        await queryRunner.query(`CREATE INDEX "IDX_11d39bdd96eccbcc7d03eea0e7" ON "categoria-social" ("id_consulta") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf5fc87ca31c7f265521205369" ON "categoria-social" ("id_categoria") `);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "nombre"`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "nombre" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."taller_duracion_enum" RENAME TO "taller_duracion_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."taller_duracion_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')`);
        await queryRunner.query(`ALTER TABLE "taller" ALTER COLUMN "duracion" TYPE "public"."taller_duracion_enum" USING "duracion"::"text"::"public"."taller_duracion_enum"`);
        await queryRunner.query(`DROP TYPE "public"."taller_duracion_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."taller_conjunto_con_enum" RENAME TO "taller_conjunto_con_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."taller_conjunto_con_enum" AS ENUM('Odontologia', 'Nutricion', 'Medicina', 'Trabajo Social', 'Psicologia', 'Equipo tecnico de apoyo', 'Sin compania', 'Pasantes', 'Otros')`);
        await queryRunner.query(`ALTER TABLE "taller" ALTER COLUMN "conjunto_con" TYPE "public"."taller_conjunto_con_enum" USING "conjunto_con"::"text"::"public"."taller_conjunto_con_enum"`);
        await queryRunner.query(`DROP TYPE "public"."taller_conjunto_con_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."consulta_turno_enum" RENAME TO "consulta_turno_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."consulta_turno_enum" AS ENUM('Mañana', 'Tarde', 'Noche', 'Jornada Completa')`);
        await queryRunner.query(`ALTER TABLE "consulta" ALTER COLUMN "turno" TYPE "public"."consulta_turno_enum" USING "turno"::"text"::"public"."consulta_turno_enum"`);
        await queryRunner.query(`DROP TYPE "public"."consulta_turno_enum_old"`);
        await queryRunner.query(`ALTER TABLE "categoria-social" ADD CONSTRAINT "FK_11d39bdd96eccbcc7d03eea0e75" FOREIGN KEY ("id_consulta") REFERENCES "social"("id_consulta") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "categoria-social" ADD CONSTRAINT "FK_bf5fc87ca31c7f265521205369f" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categoria-social" DROP CONSTRAINT "FK_bf5fc87ca31c7f265521205369f"`);
        await queryRunner.query(`ALTER TABLE "categoria-social" DROP CONSTRAINT "FK_11d39bdd96eccbcc7d03eea0e75"`);
        await queryRunner.query(`CREATE TYPE "public"."consulta_turno_enum_old" AS ENUM('Mañana', 'Noche', 'Tarde')`);
        await queryRunner.query(`ALTER TABLE "consulta" ALTER COLUMN "turno" TYPE "public"."consulta_turno_enum_old" USING "turno"::"text"::"public"."consulta_turno_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."consulta_turno_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."consulta_turno_enum_old" RENAME TO "consulta_turno_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."taller_conjunto_con_enum_old" AS ENUM('Equipo tecnico de apoyo', 'Medicina', 'Nutricion', 'Odontologia', 'Pasantes', 'Psicologia', 'Sin compania', 'Trabajo Social')`);
        await queryRunner.query(`ALTER TABLE "taller" ALTER COLUMN "conjunto_con" TYPE "public"."taller_conjunto_con_enum_old" USING "conjunto_con"::"text"::"public"."taller_conjunto_con_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."taller_conjunto_con_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."taller_conjunto_con_enum_old" RENAME TO "taller_conjunto_con_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."taller_duracion_enum_old" AS ENUM('1', '10', '11', '12', '2', '3', '4', '5', '6', '7', '8', '9')`);
        await queryRunner.query(`ALTER TABLE "taller" ALTER COLUMN "duracion" TYPE "public"."taller_duracion_enum_old" USING "duracion"::"text"::"public"."taller_duracion_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."taller_duracion_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."taller_duracion_enum_old" RENAME TO "taller_duracion_enum"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP COLUMN "nombre"`);
        await queryRunner.query(`ALTER TABLE "taller" ADD "nombre" character varying(100) NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf5fc87ca31c7f265521205369"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11d39bdd96eccbcc7d03eea0e7"`);
        await queryRunner.query(`DROP TABLE "categoria-social"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
    }

}

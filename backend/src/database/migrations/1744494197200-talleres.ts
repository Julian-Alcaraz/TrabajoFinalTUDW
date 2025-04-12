import { MigrationInterface, QueryRunner } from "typeorm";

export class Talleres1744494197200 implements MigrationInterface {
    name = 'Talleres1744494197200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "marco" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "especialidadId" integer, CONSTRAINT "PK_895a9fe32a8c7f85b021a6cf464" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."especialidad_nombre_enum" AS ENUM('Adicciones', 'Fonoaudiologia', 'Nutricion', 'Odontologia', 'Clinica')`);
        await queryRunner.query(`CREATE TABLE "especialidad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" "public"."especialidad_nombre_enum" NOT NULL, CONSTRAINT "PK_aec2a5950913ac1bb4ac83ac3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."taller_duracion_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')`);
        await queryRunner.query(`CREATE TYPE "public"."taller_destinatarios_enum" AS ENUM('Alumnos', 'Docentes', 'Familias', 'PSA', 'Todos')`);
        await queryRunner.query(`CREATE TYPE "public"."taller_turno_enum" AS ENUM('Mañana', 'Tarde', 'M y T', 'JC')`);
        await queryRunner.query(`CREATE TYPE "public"."taller_conjuntocon_enum" AS ENUM('Odontologia', 'Nutricion', 'Medicina', 'Trabajo Social', 'Psicologia', 'Equipo tecnico de apoyo', 'Sin compania', 'Pasantes')`);
        await queryRunner.query(`CREATE TABLE "taller" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "esTaller" boolean NOT NULL, "nombre" character varying(100) NOT NULL, "fecha" date NOT NULL, "cantEncuentros" integer NOT NULL, "duracion" "public"."taller_duracion_enum" NOT NULL, "cantParticipantes" integer NOT NULL, "destinatarios" "public"."taller_destinatarios_enum" NOT NULL, "observaciones" character varying(1000), "recursos" character varying(100) NOT NULL, "turno" "public"."taller_turno_enum" NOT NULL, "conjuntoCon" "public"."taller_conjuntocon_enum" NOT NULL, "frecuencia" character varying(50) NOT NULL, "institucionId" integer, "cursoId" integer, "especialidadId" integer, CONSTRAINT "PK_ca24d576961ac6345fb391b81bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "marco" ADD CONSTRAINT "FK_368dc61563a4613f6bb5eaf9a3d" FOREIGN KEY ("especialidadId") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_4c2f28abc4a289d04587ec4ddee" FOREIGN KEY ("institucionId") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_c3c90505bde06bc7da43a06846f" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_9fd97d12044983e0a36d41c395d" FOREIGN KEY ("especialidadId") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_9fd97d12044983e0a36d41c395d"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_c3c90505bde06bc7da43a06846f"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_4c2f28abc4a289d04587ec4ddee"`);
        await queryRunner.query(`ALTER TABLE "marco" DROP CONSTRAINT "FK_368dc61563a4613f6bb5eaf9a3d"`);
        await queryRunner.query(`DROP TABLE "taller"`);
        await queryRunner.query(`DROP TYPE "public"."taller_conjuntocon_enum"`);
        await queryRunner.query(`DROP TYPE "public"."taller_turno_enum"`);
        await queryRunner.query(`DROP TYPE "public"."taller_destinatarios_enum"`);
        await queryRunner.query(`DROP TYPE "public"."taller_duracion_enum"`);
        await queryRunner.query(`DROP TABLE "especialidad"`);
        await queryRunner.query(`DROP TYPE "public"."especialidad_nombre_enum"`);
        await queryRunner.query(`DROP TABLE "marco"`);
    }

}

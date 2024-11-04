import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1730579058921 implements MigrationInterface {
    name = 'Migrations1730579058921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clinica" ("id_consulta" integer NOT NULL, "diabetes" boolean NOT NULL, "hta" boolean NOT NULL, "obesidad" boolean NOT NULL, "consumo_alcohol" boolean NOT NULL, "consumo_drogas" boolean NOT NULL, "consumo_tabaco" boolean NOT NULL, "antecedentes_perinatal" boolean NOT NULL, "enfermedades_previas" boolean NOT NULL, "vacunas" character varying(100) NOT NULL, "peso" double precision NOT NULL, "talla" double precision NOT NULL, "pct" double precision NOT NULL, "cc" double precision NOT NULL, "imc" double precision NOT NULL, "pcimc" double precision NOT NULL, "estado_nutricional" character varying(100) NOT NULL, "tas" double precision NOT NULL, "tad" double precision NOT NULL, "pcta" double precision NOT NULL, "tension_arterial" character varying(100) NOT NULL, "examen_visual" character varying(100) NOT NULL, "ortopedia_traumatologia" character varying(100) NOT NULL, "lenguaje" character varying(100) NOT NULL, "segto" boolean NOT NULL, "alimentacion" character varying(100) NOT NULL, "hidratacion" character varying(100) NOT NULL, "leche" boolean NOT NULL, "infusiones" character varying(100) NOT NULL, "cantidad_comidas" character varying(100) NOT NULL, "horas_pantalla" character varying(100) NOT NULL, "horas_juego_aire_libre" character varying(100) NOT NULL, "horas_suenio" character varying(100) NOT NULL, CONSTRAINT "PK_64b678c96046d7aec0df78d169d" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "derivacion"`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "dientes_norecuperables"`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "situacion_bucal"`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "dientes_irecuperables" integer`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "derivaciones" text`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ALTER COLUMN "anteojos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "obra_social"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "obra_social" boolean`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD CONSTRAINT "FK_64b678c96046d7aec0df78d169d" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinica" DROP CONSTRAINT "FK_64b678c96046d7aec0df78d169d"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "obra_social"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD "obra_social" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ALTER COLUMN "anteojos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP COLUMN "derivaciones"`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "dientes_irecuperables"`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "situacion_bucal" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "dientes_norecuperables" integer`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "derivacion" boolean NOT NULL`);
        await queryRunner.query(`DROP TABLE "clinica"`);
    }

}

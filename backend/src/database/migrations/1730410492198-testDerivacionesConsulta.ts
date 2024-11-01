import { MigrationInterface, QueryRunner } from "typeorm";

export class TestDerivacionesConsulta1730410492198 implements MigrationInterface {
    name = 'TestDerivacionesConsulta1730410492198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "label" character varying(100) NOT NULL, "url" character varying(100) NOT NULL, "orden" integer NOT NULL, "icon" character varying(100), "menu_padre_id" integer, CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rol" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Clinica" ("id_consulta" integer NOT NULL, "diabetes" boolean NOT NULL, "hta" boolean NOT NULL, "obesidad" boolean NOT NULL, "consumo_alcohol" boolean NOT NULL, "consumo_drogas" boolean NOT NULL, "consumo_tabaco" boolean NOT NULL, "antecedentes_perinatal" boolean NOT NULL, "enfermedades_previas" boolean NOT NULL, "vacunas" character varying(100) NOT NULL, "peso" double precision NOT NULL, "talla" double precision NOT NULL, "pct" double precision NOT NULL, "cc" double precision NOT NULL, "imc" double precision NOT NULL, "pcimc" double precision NOT NULL, "estado_nutricional" character varying(100) NOT NULL, "tas" double precision NOT NULL, "tad" double precision NOT NULL, "pcta" double precision NOT NULL, "tension_arterial" character varying(100) NOT NULL, "examen_visual" character varying(100) NOT NULL, "ortopedia_traumatologia" character varying(100) NOT NULL, "lenguaje" character varying(100) NOT NULL, "segto" boolean NOT NULL, "alimentacion" character varying(100) NOT NULL, "hidratacion" character varying(100) NOT NULL, "leche" boolean NOT NULL, "infusiones" character varying(100) NOT NULL, "cantidad_comidas" character varying(100) NOT NULL, "horas_pantalla" character varying(100) NOT NULL, "horas_juego_aire_libre" character varying(100) NOT NULL, "horas_suenio" character varying(100) NOT NULL, CONSTRAINT "PK_c97111a35523dc4d38d50def81b" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "fonoaudiologia" ("id_consulta" integer NOT NULL, "asistencia" boolean NOT NULL, "diagnostico_presuntivo" character varying(100) NOT NULL, "causas" character varying(100) NOT NULL, CONSTRAINT "PK_7a7cb00668425c025a5faf83fa3" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "odontologia" ("id_consulta" integer NOT NULL, "primera_vez" boolean NOT NULL, "ulterior" boolean NOT NULL, "dientes_permanentes" integer, "dientes_temporales" integer, "sellador" integer, "topificacion" boolean NOT NULL, "cepillado" boolean NOT NULL, "derivacion" boolean NOT NULL, "dientes_recuperables" integer, "dientes_irecuperables" integer, "cepillo" boolean NOT NULL, "habitos" character varying(100) NOT NULL, "clasificacion" character varying(100) NOT NULL, CONSTRAINT "PK_a13f0d6e808bea7c3bd8067662c" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "oftalmologia" ("id_consulta" integer NOT NULL, "demanda" character varying(100) NOT NULL, "primera_vez" boolean NOT NULL, "control" boolean NOT NULL, "receta" boolean NOT NULL, "prox_control" date NOT NULL, "anteojos" boolean NOT NULL, CONSTRAINT "PK_e73ca20e3dd28958ccab04804f1" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "localidad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_e76c026cd7c5842719b7a3901ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barrio" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "id_localidad" integer, CONSTRAINT "PK_0b41150a0a8470cf8fbc3609310" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chico" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "dni" integer NOT NULL, "nombre" character varying(50) NOT NULL, "apellido" character varying(50) NOT NULL, "sexo" "public"."chico_sexo_enum" NOT NULL, "fe_nacimiento" date NOT NULL, "direccion" character varying(255), "telefono" character varying(50), "nombre_madre" character varying(100), "nombre_padre" character varying(100), "id_barrio" integer, CONSTRAINT "UQ_b402d990586b3fddd1d092944b5" UNIQUE ("dni"), CONSTRAINT "PK_539cfd384510f7d445a650c9e22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "institucion" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "tipo" "public"."institucion_tipo_enum" NOT NULL, CONSTRAINT "PK_8aa1903e37f2f82c98164b644a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curso" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "grado" integer NOT NULL, "nivel" "public"."curso_nivel_enum" NOT NULL, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_76073a915621326fb85f28ecc5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Consulta_type_enum" AS ENUM('Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia')`);
        await queryRunner.query(`CREATE TYPE "public"."Consulta_turno_enum" AS ENUM('Mañana', 'Tarde', 'Noche')`);
        await queryRunner.query(`CREATE TABLE "Consulta" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "type" "public"."Consulta_type_enum", "turno" "public"."Consulta_turno_enum", "obra_social" boolean, "edad" integer NOT NULL, "observaciones" text, "derivaciones" json NOT NULL, "id_usuario" integer, "id_chico" integer, "id_institucion" integer, "id_curso" integer, CONSTRAINT "PK_5fc15c28859b760a6c5f205f125" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "apellido" character varying(100) NOT NULL, "dni" integer NOT NULL, "email" character varying(100) NOT NULL, "contrasenia" character varying(255) NOT NULL, "especialidad" character varying(100), "fe_nacimiento" date NOT NULL, CONSTRAINT "UQ_d88d01a9aaf85b32b985061d369" UNIQUE ("dni"), CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu-rol" ("id_menu" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_3711270614667162b67cff4b78f" PRIMARY KEY ("id_menu", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_874d9038e6baa5e169682c6921" ON "menu-rol" ("id_menu") `);
        await queryRunner.query(`CREATE INDEX "IDX_a355bdae45c686776a82a48ee4" ON "menu-rol" ("id_rol") `);
        await queryRunner.query(`CREATE TABLE "usuario-rol" ("id_usuario" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_a1fa2227eec9d9fb1723e984657" PRIMARY KEY ("id_usuario", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9dc6f8933233b4378e138825" ON "usuario-rol" ("id_usuario") `);
        await queryRunner.query(`CREATE INDEX "IDX_dd4f43e8af749fc4b2e148b65b" ON "usuario-rol" ("id_rol") `);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8" FOREIGN KEY ("menu_padre_id") REFERENCES "menu"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Clinica" ADD CONSTRAINT "FK_c97111a35523dc4d38d50def81b" FOREIGN KEY ("id_consulta") REFERENCES "Consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" ADD CONSTRAINT "FK_7a7cb00668425c025a5faf83fa3" FOREIGN KEY ("id_consulta") REFERENCES "Consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD CONSTRAINT "FK_a13f0d6e808bea7c3bd8067662c" FOREIGN KEY ("id_consulta") REFERENCES "Consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "FK_e73ca20e3dd28958ccab04804f1" FOREIGN KEY ("id_consulta") REFERENCES "Consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "barrio" ADD CONSTRAINT "FK_040a3ab91b3a8d3ea56811cf0ef" FOREIGN KEY ("id_localidad") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "FK_a84afd90bc0b7ad59670d2e34f2" FOREIGN KEY ("id_barrio") REFERENCES "barrio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Consulta" ADD CONSTRAINT "FK_bac1fee7b9a5577c16515131394" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Consulta" ADD CONSTRAINT "FK_e5f3bd4cd19928665cdf9a1f403" FOREIGN KEY ("id_chico") REFERENCES "chico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Consulta" ADD CONSTRAINT "FK_4785140ab70708d0d7e30477d30" FOREIGN KEY ("id_institucion") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Consulta" ADD CONSTRAINT "FK_9672bb6fe200a664726881cd206" FOREIGN KEY ("id_curso") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu-rol" ADD CONSTRAINT "FK_874d9038e6baa5e169682c69210" FOREIGN KEY ("id_menu") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "menu-rol" ADD CONSTRAINT "FK_a355bdae45c686776a82a48ee4f" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario-rol" ADD CONSTRAINT "FK_5f9dc6f8933233b4378e1388251" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuario-rol" ADD CONSTRAINT "FK_dd4f43e8af749fc4b2e148b65b7" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario-rol" DROP CONSTRAINT "FK_dd4f43e8af749fc4b2e148b65b7"`);
        await queryRunner.query(`ALTER TABLE "usuario-rol" DROP CONSTRAINT "FK_5f9dc6f8933233b4378e1388251"`);
        await queryRunner.query(`ALTER TABLE "menu-rol" DROP CONSTRAINT "FK_a355bdae45c686776a82a48ee4f"`);
        await queryRunner.query(`ALTER TABLE "menu-rol" DROP CONSTRAINT "FK_874d9038e6baa5e169682c69210"`);
        await queryRunner.query(`ALTER TABLE "Consulta" DROP CONSTRAINT "FK_9672bb6fe200a664726881cd206"`);
        await queryRunner.query(`ALTER TABLE "Consulta" DROP CONSTRAINT "FK_4785140ab70708d0d7e30477d30"`);
        await queryRunner.query(`ALTER TABLE "Consulta" DROP CONSTRAINT "FK_e5f3bd4cd19928665cdf9a1f403"`);
        await queryRunner.query(`ALTER TABLE "Consulta" DROP CONSTRAINT "FK_bac1fee7b9a5577c16515131394"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "FK_a84afd90bc0b7ad59670d2e34f2"`);
        await queryRunner.query(`ALTER TABLE "barrio" DROP CONSTRAINT "FK_040a3ab91b3a8d3ea56811cf0ef"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "FK_e73ca20e3dd28958ccab04804f1"`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP CONSTRAINT "FK_a13f0d6e808bea7c3bd8067662c"`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" DROP CONSTRAINT "FK_7a7cb00668425c025a5faf83fa3"`);
        await queryRunner.query(`ALTER TABLE "Clinica" DROP CONSTRAINT "FK_c97111a35523dc4d38d50def81b"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dd4f43e8af749fc4b2e148b65b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f9dc6f8933233b4378e138825"`);
        await queryRunner.query(`DROP TABLE "usuario-rol"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a355bdae45c686776a82a48ee4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_874d9038e6baa5e169682c6921"`);
        await queryRunner.query(`DROP TABLE "menu-rol"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "Consulta"`);
        await queryRunner.query(`DROP TYPE "public"."Consulta_turno_enum"`);
        await queryRunner.query(`DROP TYPE "public"."Consulta_type_enum"`);
        await queryRunner.query(`DROP TABLE "curso"`);
        await queryRunner.query(`DROP TABLE "institucion"`);
        await queryRunner.query(`DROP TABLE "chico"`);
        await queryRunner.query(`DROP TABLE "barrio"`);
        await queryRunner.query(`DROP TABLE "localidad"`);
        await queryRunner.query(`DROP TABLE "oftalmologia"`);
        await queryRunner.query(`DROP TABLE "odontologia"`);
        await queryRunner.query(`DROP TABLE "fonoaudiologia"`);
        await queryRunner.query(`DROP TABLE "Clinica"`);
        await queryRunner.query(`DROP TABLE "rol"`);
        await queryRunner.query(`DROP TABLE "menu"`);
    }

}

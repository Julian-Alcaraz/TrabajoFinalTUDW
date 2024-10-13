import { MigrationInterface, QueryRunner } from "typeorm";

export class TestChicos1728850940526 implements MigrationInterface {
    name = 'TestChicos1728850940526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clinica_general" ("consultaId" integer NOT NULL, "diabetes" boolean NOT NULL, "hta" boolean NOT NULL, "obesidad" boolean NOT NULL, "consumo_alchol" boolean NOT NULL, "consumo_drogas" boolean NOT NULL, "antecedentes_perinatal" boolean NOT NULL, "enfermedades_previas" boolean NOT NULL, "vacunas" character varying(100) NOT NULL, "peso" double precision NOT NULL, "talla" double precision NOT NULL, "pct" double precision NOT NULL, "cc" double precision NOT NULL, "imc" double precision NOT NULL, "pcimc" double precision NOT NULL, "estado_nutricional" character varying(100) NOT NULL, "tas" integer NOT NULL, "tad" integer NOT NULL, "pcta" integer NOT NULL, "tension_arterial" character varying(100) NOT NULL, "examen_visual" character varying(100) NOT NULL, "ortopedia_traumatologia" character varying(100) NOT NULL, "lenguaje" character varying(100) NOT NULL, "segto" boolean NOT NULL, "alimentacion" character varying(100) NOT NULL, "hidratacion" character varying(100) NOT NULL, "lacteos" boolean NOT NULL, "infuciones" boolean NOT NULL, "numero_comidas" integer NOT NULL, "horas_pantalla" character varying(5) NOT NULL, "horas_juego_airelibre" character varying(5) NOT NULL, "horas_suenio" character varying(5) NOT NULL, "proyecto" character varying(100) NOT NULL, CONSTRAINT "PK_566cc4587a1e116aa173887af45" PRIMARY KEY ("consultaId"))`);
        await queryRunner.query(`CREATE TABLE "fonoaudiologia" ("consultaId" SERIAL NOT NULL, "detalleFonudiologia" character varying NOT NULL, CONSTRAINT "PK_442c8ced49171f77ed4bc773673" PRIMARY KEY ("consultaId"))`);
        await queryRunner.query(`CREATE TABLE "odontologia" ("consultaId" SERIAL NOT NULL, "primera_vez" boolean NOT NULL, "ulterior" boolean NOT NULL, "dientes_permanentes" integer, "dientes_temporales" integer, "sellador" integer, "topificacion" boolean NOT NULL, "cepillado" boolean NOT NULL, "derivacion" boolean NOT NULL, "dientes_recuperables" integer, "dientes_norecuperables" integer, "cepillo" boolean NOT NULL, "habitos" character varying(100) NOT NULL, "situacion_bucal" character varying(100) NOT NULL, "clasificacion" character varying(100) NOT NULL, CONSTRAINT "PK_095745a0450dfa70c9a754c9708" PRIMARY KEY ("consultaId"))`);
        await queryRunner.query(`CREATE TABLE "oftalmologia" ("consultaId" SERIAL NOT NULL, "detalleClinico" character varying NOT NULL, CONSTRAINT "PK_38d5690043f749ce4c80710cafa" PRIMARY KEY ("consultaId"))`);
        await queryRunner.query(`CREATE TABLE "localidad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_e76c026cd7c5842719b7a3901ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barrios" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "id_localidad" integer, CONSTRAINT "PK_16e28df8b7ebada77200bc7c52e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."chicos_sexo_enum" AS ENUM('Femenino', 'Masculino', 'Otro')`);
        await queryRunner.query(`CREATE TABLE "chicos" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "dni" integer NOT NULL, "nombre" character varying(100), "apellido" character varying(100), "sexo" "public"."chicos_sexo_enum", "fe_nacimiento" date, "direccion" character varying(255), "telefono" character varying(15), "nombre_madre" character varying(100), "nombre_padre" character varying(100), "id_barrio" integer, CONSTRAINT "UQ_39222f0c5f85c0dbda458ace9b1" UNIQUE ("dni"), CONSTRAINT "PK_2eea7f7893c74e42695c58123d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "institucion" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "tipo" "public"."institucion_tipo_enum" NOT NULL, CONSTRAINT "PK_8aa1903e37f2f82c98164b644a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curso" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "anio" integer NOT NULL, CONSTRAINT "PK_76073a915621326fb85f28ecc5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consulta" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "type" character varying(100), "obra_social" character varying(100), "edad" integer, "observaciones" text, "usuarioId" integer, "chicoId" integer, "institucionId" integer, "cursoId" integer, CONSTRAINT "REL_36af3728d02bc72fd5b9efd3c3" UNIQUE ("institucionId"), CONSTRAINT "REL_149d4fb8d7e85eb95e5ef11989" UNIQUE ("cursoId"), CONSTRAINT "PK_248230d7f1e2536f83b4d07c955" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "apellido" character varying(100) NOT NULL, "dni" integer NOT NULL, "email" character varying(100) NOT NULL, "contrasenia" character varying(255) NOT NULL, "especialidad" character varying(100), "fe_nacimiento" date NOT NULL, CONSTRAINT "UQ_3fd196cb306bed4b2a2e7c34154" UNIQUE ("dni"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "label" character varying(100) NOT NULL, "url" character varying(100) NOT NULL, "orden" integer NOT NULL, "icon" character varying(100), "menu_padre_id" integer, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios-roles" ("id_usuario" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_c19760fa93f292690cb3cebaf5d" PRIMARY KEY ("id_usuario", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ac61b09aaf9f413818e5c20668" ON "usuarios-roles" ("id_usuario") `);
        await queryRunner.query(`CREATE INDEX "IDX_08808e092349d1852c6ef79521" ON "usuarios-roles" ("id_rol") `);
        await queryRunner.query(`CREATE TABLE "menus-roles" ("id_menu" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_a90dcd40a5e83f41d0f5239080c" PRIMARY KEY ("id_menu", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a1f9698125ae1c672a9a0e35fd" ON "menus-roles" ("id_menu") `);
        await queryRunner.query(`CREATE INDEX "IDX_c9c78c0c81318445f8a5fd1eaf" ON "menus-roles" ("id_rol") `);
        await queryRunner.query(`ALTER TABLE "clinica_general" ADD CONSTRAINT "FK_566cc4587a1e116aa173887af45" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" ADD CONSTRAINT "FK_442c8ced49171f77ed4bc773673" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD CONSTRAINT "FK_095745a0450dfa70c9a754c9708" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "FK_38d5690043f749ce4c80710cafa" FOREIGN KEY ("consultaId") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "barrios" ADD CONSTRAINT "FK_7da88ddddff4ea9dee6f44e1805" FOREIGN KEY ("id_localidad") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chicos" ADD CONSTRAINT "FK_b224013fb71509e8b89a356846c" FOREIGN KEY ("id_barrio") REFERENCES "barrios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_1fe809eb27c3a3ddfc8be164fe7" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_3da8915c94de2912bae8d519ae2" FOREIGN KEY ("chicoId") REFERENCES "chicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b" FOREIGN KEY ("institucionId") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menus" ADD CONSTRAINT "FK_a561ecaa1a6534e2a13365cf60f" FOREIGN KEY ("menu_padre_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios-roles" ADD CONSTRAINT "FK_ac61b09aaf9f413818e5c206689" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuarios-roles" ADD CONSTRAINT "FK_08808e092349d1852c6ef79521b" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menus-roles" ADD CONSTRAINT "FK_a1f9698125ae1c672a9a0e35fde" FOREIGN KEY ("id_menu") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "menus-roles" ADD CONSTRAINT "FK_c9c78c0c81318445f8a5fd1eafe" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menus-roles" DROP CONSTRAINT "FK_c9c78c0c81318445f8a5fd1eafe"`);
        await queryRunner.query(`ALTER TABLE "menus-roles" DROP CONSTRAINT "FK_a1f9698125ae1c672a9a0e35fde"`);
        await queryRunner.query(`ALTER TABLE "usuarios-roles" DROP CONSTRAINT "FK_08808e092349d1852c6ef79521b"`);
        await queryRunner.query(`ALTER TABLE "usuarios-roles" DROP CONSTRAINT "FK_ac61b09aaf9f413818e5c206689"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_a561ecaa1a6534e2a13365cf60f"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_149d4fb8d7e85eb95e5ef11989a"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_36af3728d02bc72fd5b9efd3c3b"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_3da8915c94de2912bae8d519ae2"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_1fe809eb27c3a3ddfc8be164fe7"`);
        await queryRunner.query(`ALTER TABLE "chicos" DROP CONSTRAINT "FK_b224013fb71509e8b89a356846c"`);
        await queryRunner.query(`ALTER TABLE "barrios" DROP CONSTRAINT "FK_7da88ddddff4ea9dee6f44e1805"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "FK_38d5690043f749ce4c80710cafa"`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP CONSTRAINT "FK_095745a0450dfa70c9a754c9708"`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" DROP CONSTRAINT "FK_442c8ced49171f77ed4bc773673"`);
        await queryRunner.query(`ALTER TABLE "clinica_general" DROP CONSTRAINT "FK_566cc4587a1e116aa173887af45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9c78c0c81318445f8a5fd1eaf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1f9698125ae1c672a9a0e35fd"`);
        await queryRunner.query(`DROP TABLE "menus-roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08808e092349d1852c6ef79521"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac61b09aaf9f413818e5c20668"`);
        await queryRunner.query(`DROP TABLE "usuarios-roles"`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "consulta"`);
        await queryRunner.query(`DROP TABLE "curso"`);
        await queryRunner.query(`DROP TABLE "institucion"`);
        await queryRunner.query(`DROP TABLE "chicos"`);
        await queryRunner.query(`DROP TYPE "public"."chicos_sexo_enum"`);
        await queryRunner.query(`DROP TABLE "barrios"`);
        await queryRunner.query(`DROP TABLE "localidad"`);
        await queryRunner.query(`DROP TABLE "oftalmologia"`);
        await queryRunner.query(`DROP TABLE "odontologia"`);
        await queryRunner.query(`DROP TABLE "fonoaudiologia"`);
        await queryRunner.query(`DROP TABLE "clinica_general"`);
    }

}

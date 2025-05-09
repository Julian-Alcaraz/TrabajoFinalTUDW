import { MigrationInterface, QueryRunner } from "typeorm";

export class A1746794692586 implements MigrationInterface {
    name = 'A1746794692586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "label" character varying(50) NOT NULL, "url" character varying(50) NOT NULL, "orden" integer NOT NULL, "icon" character varying(50), "menu_padre_id" integer, CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rol" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(50) NOT NULL, CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clinica" ("id_consulta" integer NOT NULL, "vacunas" "public"."clinica_vacunas_enum", "examen_visual" "public"."clinica_examen_visual_enum", "ortopedia_traumatologia" "public"."clinica_ortopedia_traumatologia_enum", "lenguaje" "public"."clinica_lenguaje_enum", "alimentacion" "public"."clinica_alimentacion_enum", "infusiones" "public"."clinica_infusiones_enum", "cantidad_comidas" "public"."clinica_cantidad_comidas_enum", "horas_pantalla" "public"."clinica_horas_pantalla_enum", "horas_juego_aire_libre" "public"."clinica_horas_juego_aire_libre_enum", "horas_suenio" "public"."clinica_horas_suenio_enum", "hidratacion" "public"."clinica_hidratacion_enum", "diabetes" boolean, "hta" boolean, "es_clinica" boolean NOT NULL DEFAULT true, "obesidad" boolean, "consumo_alcohol" boolean, "consumo_drogas" boolean, "consumo_tabaco" boolean, "antecedentes_perinatal" boolean, "enfermedades_previas" boolean, "peso" double precision NOT NULL, "talla" double precision NOT NULL, "pct" double precision NOT NULL, "cc" double precision NOT NULL, "imc" double precision NOT NULL, "pcimc" double precision NOT NULL, "estado_nutricional" character varying(100) NOT NULL, "tas" double precision, "tad" double precision, "pcta" double precision, "tension_arterial" character varying(100), "segto" boolean NOT NULL, "leche" boolean, CONSTRAINT "PK_64b678c96046d7aec0df78d169d" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "fonoaudiologia" ("id_consulta" integer NOT NULL, "asistencia" boolean NOT NULL, "diagnostico_presuntivo" "public"."fonoaudiologia_diagnostico_presuntivo_enum" NOT NULL, "causas" "public"."fonoaudiologia_causas_enum" NOT NULL, CONSTRAINT "PK_7a7cb00668425c025a5faf83fa3" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "odontologia" ("id_consulta" integer NOT NULL, "primera_vez" boolean NOT NULL, "ulterior" boolean NOT NULL, "dientes_permanentes" integer, "dientes_temporales" integer, "sellador" integer, "topificacion" boolean NOT NULL, "cepillado" boolean NOT NULL, "dientes_recuperables" integer, "dientes_irecuperables" integer, "cepillo" boolean NOT NULL, "clasificacion" character varying(100) NOT NULL, "habitos" character varying(1000), CONSTRAINT "PK_a13f0d6e808bea7c3bd8067662c" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "oftalmologia" ("id_consulta" integer NOT NULL, "demanda" "public"."oftalmologia_demanda_enum" NOT NULL, "primera_vez" boolean NOT NULL, "control" boolean NOT NULL, "receta" boolean NOT NULL, "prox_control" date NOT NULL, "anteojos" boolean, CONSTRAINT "PK_e73ca20e3dd28958ccab04804f1" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "localidad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(50) NOT NULL, CONSTRAINT "PK_e76c026cd7c5842719b7a3901ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barrio" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "id_localidad" integer, CONSTRAINT "PK_0b41150a0a8470cf8fbc3609310" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chico" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "dni" integer NOT NULL, "nombre" character varying(50) NOT NULL, "apellido" character varying(50) NOT NULL, "sexo" "public"."chico_sexo_enum" NOT NULL, "fe_nacimiento" date NOT NULL, "direccion" character varying(255), "telefono" character varying(30), "nombre_madre" character varying(100), "nombre_padre" character varying(100), "id_barrio" integer, CONSTRAINT "UQ_b402d990586b3fddd1d092944b5" UNIQUE ("dni"), CONSTRAINT "PK_539cfd384510f7d445a650c9e22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curso" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nivel" "public"."curso_nivel_enum" NOT NULL, "nombre" character varying(50) NOT NULL, CONSTRAINT "PK_76073a915621326fb85f28ecc5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "marco" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "id_especialidad" integer, CONSTRAINT "PK_895a9fe32a8c7f85b021a6cf464" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "especialidad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" "public"."especialidad_nombre_enum" NOT NULL, CONSTRAINT "PK_aec2a5950913ac1bb4ac83ac3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "taller" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "fecha" date NOT NULL, "cant_encuentros" integer NOT NULL, "duracion" "public"."taller_duracion_enum" NOT NULL, "cant_participantes" integer NOT NULL, "destinatarios" "public"."taller_destinatarios_enum" NOT NULL, "recursos" character varying(100) NOT NULL, "turno" "public"."taller_turno_enum" NOT NULL, "conjunto_con" "public"."taller_conjunto_con_enum" NOT NULL, "frecuencia" "public"."taller_frecuencia_enum" NOT NULL, "es_taller" boolean NOT NULL, "observaciones" character varying(1000), "entrega_cepillos" boolean, "id_institucion" integer, "id_curso" integer, "id_especialidad" integer, "id_marco" integer, CONSTRAINT "PK_ca24d576961ac6345fb391b81bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "institucion" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "tipo" "public"."institucion_tipo_enum" NOT NULL, CONSTRAINT "PK_8aa1903e37f2f82c98164b644a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prevencion" ("id_consulta" integer NOT NULL, "edad_inicio_consumo" integer, "motivo_consumo" "public"."prevencion_motivo_consumo_enum" NOT NULL, "frecuencia" "public"."prevencion_frecuencia_enum" NOT NULL, "consumo_problematico" "public"."prevencion_consumo_problematico_enum", "otra_problematica" "public"."prevencion_otra_problematica_enum", CONSTRAINT "PK_18f0d6edf144c947c55d92949c4" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "social" ("id_consulta" integer NOT NULL, "demanda" character varying(100), "articulacion" character varying(1000), "objeto_informe" character varying(1000), "seguimiento" character varying(1000), CONSTRAINT "PK_5b4771e46b6a22de80cf673b987" PRIMARY KEY ("id_consulta"))`);
        await queryRunner.query(`CREATE TABLE "consulta" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "type" "public"."consulta_type_enum", "turno" "public"."consulta_turno_enum", "obra_social" boolean, "edad" integer NOT NULL, "observaciones" character varying(1000), "derivacion_oftalmologia" boolean NOT NULL DEFAULT false, "derivacion_odontologia" boolean NOT NULL DEFAULT false, "derivacion_fonoaudiologia" boolean NOT NULL DEFAULT false, "derivacion_prevencion" boolean NOT NULL DEFAULT false, "derivacion_social" boolean NOT NULL DEFAULT false, "derivacion_externa" boolean NOT NULL DEFAULT false, "id_usuario" integer, "id_chico" integer, "id_institucion" integer, "id_curso" integer, CONSTRAINT "PK_248230d7f1e2536f83b4d07c955" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(50) NOT NULL, "apellido" character varying(50) NOT NULL, "dni" integer NOT NULL, "email" character varying(255) NOT NULL, "contrasenia" character varying(255) NOT NULL, "fe_nacimiento" date NOT NULL, CONSTRAINT "UQ_d88d01a9aaf85b32b985061d369" UNIQUE ("dni"), CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu-rol" ("id_menu" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_3711270614667162b67cff4b78f" PRIMARY KEY ("id_menu", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_874d9038e6baa5e169682c6921" ON "menu-rol" ("id_menu") `);
        await queryRunner.query(`CREATE INDEX "IDX_a355bdae45c686776a82a48ee4" ON "menu-rol" ("id_rol") `);
        await queryRunner.query(`CREATE TABLE "usuario-rol" ("id_usuario" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_a1fa2227eec9d9fb1723e984657" PRIMARY KEY ("id_usuario", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9dc6f8933233b4378e138825" ON "usuario-rol" ("id_usuario") `);
        await queryRunner.query(`CREATE INDEX "IDX_dd4f43e8af749fc4b2e148b65b" ON "usuario-rol" ("id_rol") `);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8" FOREIGN KEY ("menu_padre_id") REFERENCES "menu"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD CONSTRAINT "FK_64b678c96046d7aec0df78d169d" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" ADD CONSTRAINT "FK_7a7cb00668425c025a5faf83fa3" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD CONSTRAINT "FK_a13f0d6e808bea7c3bd8067662c" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" ADD CONSTRAINT "FK_e73ca20e3dd28958ccab04804f1" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "barrio" ADD CONSTRAINT "FK_040a3ab91b3a8d3ea56811cf0ef" FOREIGN KEY ("id_localidad") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "FK_a84afd90bc0b7ad59670d2e34f2" FOREIGN KEY ("id_barrio") REFERENCES "barrio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "marco" ADD CONSTRAINT "FK_a134c5ab06accf12bc9eac2c4ba" FOREIGN KEY ("id_especialidad") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_aa4cc8d797808bd163dbb005553" FOREIGN KEY ("id_institucion") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_ce2c4f6f93d1e52b9fa18d1a78c" FOREIGN KEY ("id_curso") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_3e8b06d8b2dbf5ccf273e2fb51f" FOREIGN KEY ("id_especialidad") REFERENCES "especialidad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taller" ADD CONSTRAINT "FK_8da01a6102a586ac10c2fcf55db" FOREIGN KEY ("id_marco") REFERENCES "marco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prevencion" ADD CONSTRAINT "FK_18f0d6edf144c947c55d92949c4" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social" ADD CONSTRAINT "FK_5b4771e46b6a22de80cf673b987" FOREIGN KEY ("id_consulta") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_e9832cf56d015655efe7c9c001f" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_cc2dd14a164af7886dcb989ee11" FOREIGN KEY ("id_chico") REFERENCES "chico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_69940fbdef19d6a5e9f15f144bc" FOREIGN KEY ("id_institucion") REFERENCES "institucion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_faff082e170b77afdc72c216c88" FOREIGN KEY ("id_curso") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_faff082e170b77afdc72c216c88"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_69940fbdef19d6a5e9f15f144bc"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_cc2dd14a164af7886dcb989ee11"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_e9832cf56d015655efe7c9c001f"`);
        await queryRunner.query(`ALTER TABLE "social" DROP CONSTRAINT "FK_5b4771e46b6a22de80cf673b987"`);
        await queryRunner.query(`ALTER TABLE "prevencion" DROP CONSTRAINT "FK_18f0d6edf144c947c55d92949c4"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_8da01a6102a586ac10c2fcf55db"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_3e8b06d8b2dbf5ccf273e2fb51f"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_ce2c4f6f93d1e52b9fa18d1a78c"`);
        await queryRunner.query(`ALTER TABLE "taller" DROP CONSTRAINT "FK_aa4cc8d797808bd163dbb005553"`);
        await queryRunner.query(`ALTER TABLE "marco" DROP CONSTRAINT "FK_a134c5ab06accf12bc9eac2c4ba"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "FK_a84afd90bc0b7ad59670d2e34f2"`);
        await queryRunner.query(`ALTER TABLE "barrio" DROP CONSTRAINT "FK_040a3ab91b3a8d3ea56811cf0ef"`);
        await queryRunner.query(`ALTER TABLE "oftalmologia" DROP CONSTRAINT "FK_e73ca20e3dd28958ccab04804f1"`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP CONSTRAINT "FK_a13f0d6e808bea7c3bd8067662c"`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" DROP CONSTRAINT "FK_7a7cb00668425c025a5faf83fa3"`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP CONSTRAINT "FK_64b678c96046d7aec0df78d169d"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dd4f43e8af749fc4b2e148b65b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f9dc6f8933233b4378e138825"`);
        await queryRunner.query(`DROP TABLE "usuario-rol"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a355bdae45c686776a82a48ee4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_874d9038e6baa5e169682c6921"`);
        await queryRunner.query(`DROP TABLE "menu-rol"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "consulta"`);
        await queryRunner.query(`DROP TABLE "social"`);
        await queryRunner.query(`DROP TABLE "prevencion"`);
        await queryRunner.query(`DROP TABLE "institucion"`);
        await queryRunner.query(`DROP TABLE "taller"`);
        await queryRunner.query(`DROP TABLE "especialidad"`);
        await queryRunner.query(`DROP TABLE "marco"`);
        await queryRunner.query(`DROP TABLE "curso"`);
        await queryRunner.query(`DROP TABLE "chico"`);
        await queryRunner.query(`DROP TABLE "barrio"`);
        await queryRunner.query(`DROP TABLE "localidad"`);
        await queryRunner.query(`DROP TABLE "oftalmologia"`);
        await queryRunner.query(`DROP TABLE "odontologia"`);
        await queryRunner.query(`DROP TABLE "fonoaudiologia"`);
        await queryRunner.query(`DROP TABLE "clinica"`);
        await queryRunner.query(`DROP TABLE "rol"`);
        await queryRunner.query(`DROP TABLE "menu"`);
    }

}

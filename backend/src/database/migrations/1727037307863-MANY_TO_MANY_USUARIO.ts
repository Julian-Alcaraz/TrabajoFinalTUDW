import { MigrationInterface, QueryRunner } from "typeorm";

export class MANYTOMANYUSUARIO1727037307863 implements MigrationInterface {
    name = 'MANYTOMANYUSUARIO1727037307863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "label" character varying(100) NOT NULL, "url" character varying(100) NOT NULL, "orden" integer NOT NULL, "icon" character varying(100), "menu_padre_id" integer, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, "apellido" character varying(100) NOT NULL, "dni" integer NOT NULL, "email" character varying(100) NOT NULL, "contrasenia" character varying(255) NOT NULL, "especialidad" character varying(100), "fe_nacimiento" date NOT NULL, CONSTRAINT "UQ_3fd196cb306bed4b2a2e7c34154" UNIQUE ("dni"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deshabilitado" boolean NOT NULL DEFAULT false, "nombre" character varying(100) NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menus-roles" ("id_menu" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_a90dcd40a5e83f41d0f5239080c" PRIMARY KEY ("id_menu", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a1f9698125ae1c672a9a0e35fd" ON "menus-roles" ("id_menu") `);
        await queryRunner.query(`CREATE INDEX "IDX_c9c78c0c81318445f8a5fd1eaf" ON "menus-roles" ("id_rol") `);
        await queryRunner.query(`CREATE TABLE "usuarios-roles" ("id_usuario" integer NOT NULL, "id_rol" integer NOT NULL, CONSTRAINT "PK_c19760fa93f292690cb3cebaf5d" PRIMARY KEY ("id_usuario", "id_rol"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ac61b09aaf9f413818e5c20668" ON "usuarios-roles" ("id_usuario") `);
        await queryRunner.query(`CREATE INDEX "IDX_08808e092349d1852c6ef79521" ON "usuarios-roles" ("id_rol") `);
        await queryRunner.query(`ALTER TABLE "menus" ADD CONSTRAINT "FK_a561ecaa1a6534e2a13365cf60f" FOREIGN KEY ("menu_padre_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menus-roles" ADD CONSTRAINT "FK_a1f9698125ae1c672a9a0e35fde" FOREIGN KEY ("id_menu") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "menus-roles" ADD CONSTRAINT "FK_c9c78c0c81318445f8a5fd1eafe" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios-roles" ADD CONSTRAINT "FK_ac61b09aaf9f413818e5c206689" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuarios-roles" ADD CONSTRAINT "FK_08808e092349d1852c6ef79521b" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios-roles" DROP CONSTRAINT "FK_08808e092349d1852c6ef79521b"`);
        await queryRunner.query(`ALTER TABLE "usuarios-roles" DROP CONSTRAINT "FK_ac61b09aaf9f413818e5c206689"`);
        await queryRunner.query(`ALTER TABLE "menus-roles" DROP CONSTRAINT "FK_c9c78c0c81318445f8a5fd1eafe"`);
        await queryRunner.query(`ALTER TABLE "menus-roles" DROP CONSTRAINT "FK_a1f9698125ae1c672a9a0e35fde"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_a561ecaa1a6534e2a13365cf60f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08808e092349d1852c6ef79521"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac61b09aaf9f413818e5c20668"`);
        await queryRunner.query(`DROP TABLE "usuarios-roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9c78c0c81318445f8a5fd1eaf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1f9698125ae1c672a9a0e35fd"`);
        await queryRunner.query(`DROP TABLE "menus-roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "menus"`);
    }

}

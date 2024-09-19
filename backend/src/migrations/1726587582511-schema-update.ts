import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1726587582511 implements MigrationInterface {
  name = 'SchemaUpdate1726587582511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "url" character varying(100) NOT NULL, "orden" integer NOT NULL, "deshabilitado" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "menu_padre_id" integer, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "menus-roles" ("id_rol" integer NOT NULL, "id_menu" integer NOT NULL, CONSTRAINT "PK_a90dcd40a5e83f41d0f5239080c" PRIMARY KEY ("id_rol", "id_menu"))`);
    await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "deshabilitado" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "apellido" character varying(100) NOT NULL, "dni" integer NOT NULL, "email" character varying(100) NOT NULL, "contrasenia" character varying(100) NOT NULL, "especialidad" character varying(100), "fe_nacimiento" date NOT NULL, "deshabilitado" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_3fd196cb306bed4b2a2e7c34154" UNIQUE ("dni"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "usuarios-roles" ("id_rol" integer NOT NULL, "id_usuario" integer NOT NULL, CONSTRAINT "PK_c19760fa93f292690cb3cebaf5d" PRIMARY KEY ("id_rol", "id_usuario"))`);
    await queryRunner.query(`ALTER TABLE "menus" ADD CONSTRAINT "FK_a561ecaa1a6534e2a13365cf60f" FOREIGN KEY ("menu_padre_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menus-roles" ADD CONSTRAINT "FK_c9c78c0c81318445f8a5fd1eafe" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menus-roles" ADD CONSTRAINT "FK_a1f9698125ae1c672a9a0e35fde" FOREIGN KEY ("id_menu") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "usuarios-roles" ADD CONSTRAINT "FK_08808e092349d1852c6ef79521b" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "usuarios-roles" ADD CONSTRAINT "FK_ac61b09aaf9f413818e5c206689" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuarios-roles" DROP CONSTRAINT "FK_ac61b09aaf9f413818e5c206689"`);
    await queryRunner.query(`ALTER TABLE "usuarios-roles" DROP CONSTRAINT "FK_08808e092349d1852c6ef79521b"`);
    await queryRunner.query(`ALTER TABLE "menus-roles" DROP CONSTRAINT "FK_a1f9698125ae1c672a9a0e35fde"`);
    await queryRunner.query(`ALTER TABLE "menus-roles" DROP CONSTRAINT "FK_c9c78c0c81318445f8a5fd1eafe"`);
    await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_a561ecaa1a6534e2a13365cf60f"`);
    await queryRunner.query(`DROP TABLE "usuarios-roles"`);
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "menus-roles"`);
    await queryRunner.query(`DROP TABLE "menus"`);
  }
}

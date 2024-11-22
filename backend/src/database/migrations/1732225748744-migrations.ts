import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1732225748744 implements MigrationInterface {
    name = 'Migrations1732225748744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "curso" DROP COLUMN "grado"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "especialidad"`);
        await queryRunner.query(`ALTER TYPE "public"."curso_nivel_enum" RENAME TO "curso_nivel_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."curso_nivel_enum" AS ENUM('Jardin', 'Primario', 'Secundario')`);
        await queryRunner.query(`ALTER TABLE "curso" ALTER COLUMN "nivel" TYPE "public"."curso_nivel_enum" USING "nivel"::"text"::"public"."curso_nivel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."curso_nivel_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."curso_nivel_enum_old" AS ENUM('Primaria', 'Secundario', 'Jardin', 'Terciario', 'Universitario')`);
        await queryRunner.query(`ALTER TABLE "curso" ALTER COLUMN "nivel" TYPE "public"."curso_nivel_enum_old" USING "nivel"::"text"::"public"."curso_nivel_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."curso_nivel_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."curso_nivel_enum_old" RENAME TO "curso_nivel_enum"`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "especialidad" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "curso" ADD "grado" integer NOT NULL`);
    }

}

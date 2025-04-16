import { MigrationInterface, QueryRunner } from "typeorm";

export class Talleres1744836584700 implements MigrationInterface {
    name = 'Talleres1744836584700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."taller_frecuencia_enum" RENAME TO "taller_frecuencia_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."taller_frecuencia_enum" AS ENUM('Única vez', 'Diaria', 'Semanal', 'Mensual')`);
        await queryRunner.query(`ALTER TABLE "taller" ALTER COLUMN "frecuencia" TYPE "public"."taller_frecuencia_enum" USING "frecuencia"::"text"::"public"."taller_frecuencia_enum"`);
        await queryRunner.query(`DROP TYPE "public"."taller_frecuencia_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."taller_frecuencia_enum_old" AS ENUM('Diaria', 'Mensual', 'Semanal')`);
        await queryRunner.query(`ALTER TABLE "taller" ALTER COLUMN "frecuencia" TYPE "public"."taller_frecuencia_enum_old" USING "frecuencia"::"text"::"public"."taller_frecuencia_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."taller_frecuencia_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."taller_frecuencia_enum_old" RENAME TO "taller_frecuencia_enum"`);
    }

}

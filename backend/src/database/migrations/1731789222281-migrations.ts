import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731789222281 implements MigrationInterface {
    name = 'Migrations1731789222281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "vacunas"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_vacunas_enum" AS ENUM('Completo', 'Incompleto', 'Desconocido')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "vacunas" "public"."clinica_vacunas_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "examen_visual"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_examen_visual_enum" AS ENUM('Normal', 'Anormal')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "examen_visual" "public"."clinica_examen_visual_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "ortopedia_traumatologia"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_ortopedia_traumatologia_enum" AS ENUM('Normal', 'Escoliosis', 'Pie Plano', 'Otras')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "ortopedia_traumatologia" "public"."clinica_ortopedia_traumatologia_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "lenguaje"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_lenguaje_enum" AS ENUM('Adecuado', 'Inadecuado')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "lenguaje" "public"."clinica_lenguaje_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "alimentacion"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_alimentacion_enum" AS ENUM('Mixta y variada', 'Rica en HdC', 'Pobre en fibras', 'Fiambres', 'Frituras')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "alimentacion" "public"."clinica_alimentacion_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "infusiones"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_infusiones_enum" AS ENUM('Té', 'Mate Cocido', 'Otras')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "infusiones" "public"."clinica_infusiones_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "cantidad_comidas"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_cantidad_comidas_enum" AS ENUM('Menor a 4', '4', 'Mayor a 4', 'Picoteo')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "cantidad_comidas" "public"."clinica_cantidad_comidas_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "horas_pantalla"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_horas_pantalla_enum" AS ENUM('Menor a 2hs', 'Entre 2hs y 4hs', 'Más de 6hs')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "horas_pantalla" "public"."clinica_horas_pantalla_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "horas_juego_aire_libre"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_horas_juego_aire_libre_enum" AS ENUM('Menos de 1h', '1h', 'Más de 1h')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "horas_juego_aire_libre" "public"."clinica_horas_juego_aire_libre_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "horas_suenio"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_horas_suenio_enum" AS ENUM('Menos de 10hs', 'Entre 10hs y 12hs', 'Más de 13hs')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "horas_suenio" "public"."clinica_horas_suenio_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "hidratacion"`);
        await queryRunner.query(`CREATE TYPE "public"."clinica_hidratacion_enum" AS ENUM('Agua', 'Bebidas Edulcoradas')`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "hidratacion" "public"."clinica_hidratacion_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" DROP COLUMN "diagnostico_presuntivo"`);
        await queryRunner.query(`CREATE TYPE "public"."fonoaudiologia_diagnostico_presuntivo_enum" AS ENUM('TEL', 'TEA', 'Retraso en el lenguaje, dislalias funcionales', 'Respirador bucal', 'Anquiloglosia', 'Ortodoncia: Protrusión lingual, paladar hendido', 'Síndromes', 'Otras patologías que dificulten el lenguaje y la comunicación')`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" ADD "diagnostico_presuntivo" "public"."fonoaudiologia_diagnostico_presuntivo_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" DROP COLUMN "causas"`);
        await queryRunner.query(`CREATE TYPE "public"."fonoaudiologia_causas_enum" AS ENUM('Prenatal', 'Postnatal', 'ACV', 'Respiratorias', 'Audición', 'Patologías clínicas', 'Síndromes', 'Inflamación de amígdalas o adenoides', 'Prematurez', 'Otras')`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" ADD "causas" "public"."fonoaudiologia_causas_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "habitos"`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "habitos" text`);
        await queryRunner.query(`ALTER TABLE "consulta" ALTER COLUMN "derivaciones" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" ALTER COLUMN "derivaciones" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "odontologia" DROP COLUMN "habitos"`);
        await queryRunner.query(`ALTER TABLE "odontologia" ADD "habitos" character varying(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" DROP COLUMN "causas"`);
        await queryRunner.query(`DROP TYPE "public"."fonoaudiologia_causas_enum"`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" ADD "causas" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" DROP COLUMN "diagnostico_presuntivo"`);
        await queryRunner.query(`DROP TYPE "public"."fonoaudiologia_diagnostico_presuntivo_enum"`);
        await queryRunner.query(`ALTER TABLE "fonoaudiologia" ADD "diagnostico_presuntivo" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "hidratacion"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_hidratacion_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "hidratacion" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "horas_suenio"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_horas_suenio_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "horas_suenio" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "horas_juego_aire_libre"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_horas_juego_aire_libre_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "horas_juego_aire_libre" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "horas_pantalla"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_horas_pantalla_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "horas_pantalla" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "cantidad_comidas"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_cantidad_comidas_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "cantidad_comidas" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "infusiones"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_infusiones_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "infusiones" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "alimentacion"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_alimentacion_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "alimentacion" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "lenguaje"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_lenguaje_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "lenguaje" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "ortopedia_traumatologia"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_ortopedia_traumatologia_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "ortopedia_traumatologia" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "examen_visual"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_examen_visual_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "examen_visual" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinica" DROP COLUMN "vacunas"`);
        await queryRunner.query(`DROP TYPE "public"."clinica_vacunas_enum"`);
        await queryRunner.query(`ALTER TABLE "clinica" ADD "vacunas" character varying(100) NOT NULL`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1728570855634 implements MigrationInterface {
    name = 'Migrations1728570855634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_44e957c5a5a99753007cd8b9eca"`);
        await queryRunner.query(`ALTER TABLE "consulta" RENAME COLUMN "chicoDni" TO "chicoId"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "PK_b402d990586b3fddd1d092944b5"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "PK_fc738a296340efa367ec8a9c08c" PRIMARY KEY ("dni", "id")`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "PK_fc738a296340efa367ec8a9c08c"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "PK_539cfd384510f7d445a650c9e22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "UQ_b402d990586b3fddd1d092944b5" UNIQUE ("dni")`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_3da8915c94de2912bae8d519ae2" FOREIGN KEY ("chicoId") REFERENCES "chico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_3da8915c94de2912bae8d519ae2"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "UQ_b402d990586b3fddd1d092944b5"`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "PK_539cfd384510f7d445a650c9e22"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "PK_fc738a296340efa367ec8a9c08c" PRIMARY KEY ("dni", "id")`);
        await queryRunner.query(`ALTER TABLE "chico" DROP CONSTRAINT "PK_fc738a296340efa367ec8a9c08c"`);
        await queryRunner.query(`ALTER TABLE "chico" ADD CONSTRAINT "PK_b402d990586b3fddd1d092944b5" PRIMARY KEY ("dni")`);
        await queryRunner.query(`ALTER TABLE "chico" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "consulta" RENAME COLUMN "chicoId" TO "chicoDni"`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_44e957c5a5a99753007cd8b9eca" FOREIGN KEY ("chicoDni") REFERENCES "chico"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

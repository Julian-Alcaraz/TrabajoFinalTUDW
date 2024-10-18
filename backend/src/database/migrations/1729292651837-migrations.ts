import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1729292651837 implements MigrationInterface {
  name = 'Migrations1729292651837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_3da8915c94de2912bae8d519ae2"`);
    await queryRunner.query(`ALTER TABLE "consulta" RENAME COLUMN "chicoId" TO "id_chico"`);
    await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8"`);
    await queryRunner.query(`ALTER TABLE "menu-rol" DROP CONSTRAINT "FK_874d9038e6baa5e169682c69210"`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "menu_id_seq" OWNED BY "menu"."id"`);
    await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "id" SET DEFAULT nextval('"menu_id_seq"')`);
    await queryRunner.query(`ALTER TABLE "menu-rol" DROP CONSTRAINT "FK_a355bdae45c686776a82a48ee4f"`);
    await queryRunner.query(`ALTER TABLE "usuario-rol" DROP CONSTRAINT "FK_dd4f43e8af749fc4b2e148b65b7"`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "rol_id_seq" OWNED BY "rol"."id"`);
    await queryRunner.query(`ALTER TABLE "rol" ALTER COLUMN "id" SET DEFAULT nextval('"rol_id_seq"')`);
    await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_e9832cf56d015655efe7c9c001f"`);
    await queryRunner.query(`ALTER TABLE "usuario-rol" DROP CONSTRAINT "FK_5f9dc6f8933233b4378e1388251"`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "usuario_id_seq" OWNED BY "usuario"."id"`);
    await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "id" SET DEFAULT nextval('"usuario_id_seq"')`);
    await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8" FOREIGN KEY ("menu_padre_id") REFERENCES "menu"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_e9832cf56d015655efe7c9c001f" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_cc2dd14a164af7886dcb989ee11" FOREIGN KEY ("id_chico") REFERENCES "chico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
    await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_cc2dd14a164af7886dcb989ee11"`);
    await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_e9832cf56d015655efe7c9c001f"`);
    await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8"`);
    await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "usuario_id_seq"`);
    await queryRunner.query(`ALTER TABLE "usuario-rol" ADD CONSTRAINT "FK_5f9dc6f8933233b4378e1388251" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_e9832cf56d015655efe7c9c001f" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "rol" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "rol_id_seq"`);
    await queryRunner.query(`ALTER TABLE "usuario-rol" ADD CONSTRAINT "FK_dd4f43e8af749fc4b2e148b65b7" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu-rol" ADD CONSTRAINT "FK_a355bdae45c686776a82a48ee4f" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "menu_id_seq"`);
    await queryRunner.query(`ALTER TABLE "menu-rol" ADD CONSTRAINT "FK_874d9038e6baa5e169682c69210" FOREIGN KEY ("id_menu") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_37f2e27b30f74177134a9ed24a8" FOREIGN KEY ("menu_padre_id") REFERENCES "menu"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "consulta" RENAME COLUMN "id_chico" TO "chicoId"`);
    await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_3da8915c94de2912bae8d519ae2" FOREIGN KEY ("chicoId") REFERENCES "chico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}

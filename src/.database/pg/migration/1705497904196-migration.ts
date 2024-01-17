import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705497904196 implements MigrationInterface {
    name = 'Migration1705497904196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_user_type_enum" AS ENUM('admin', 'client')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_type" "public"."user_user_type_enum" NOT NULL DEFAULT 'client'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."user_user_type_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705405947118 implements MigrationInterface {
    name = 'Migration1705405947118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "user_jwt" TO "refresh_token"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "refresh_token" TO "user_jwt"`);
    }

}

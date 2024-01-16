import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705405701906 implements MigrationInterface {
    name = 'Migration1705405701906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "user_jwt" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_jwt"`);
    }

}

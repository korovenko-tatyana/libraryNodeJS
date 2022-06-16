import {MigrationInterface, QueryRunner} from "typeorm";

export class migration41653983841427 implements MigrationInterface {
    name = 'migration41653983841427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying array NOT NULL DEFAULT '{ROLE_USER}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}

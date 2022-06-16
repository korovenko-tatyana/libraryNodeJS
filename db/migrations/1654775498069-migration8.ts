import {MigrationInterface, QueryRunner} from "typeorm";

export class migration81654775498069 implements MigrationInterface {
    name = 'migration81654775498069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "setting_integration_amo_crm" ("id" SERIAL NOT NULL, "clientId" character varying NOT NULL, "secretKey" character varying NOT NULL, "clientUrl" character varying NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expires" integer NOT NULL, CONSTRAINT "PK_38bcaf12434642e865a0bdf0a8c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "setting_integration_amo_crm"`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class migration61654265532002 implements MigrationInterface {
    name = 'migration61654265532002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."book_state_enum" AS ENUM('new', 'medium', 'bad', 'relic')`);
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "articleNumber" character varying NOT NULL, "author" character varying, "year" integer, "description" character varying, "binding" boolean, "numberOfPages" integer, "price" double precision, "countAll" integer, "countUsers" integer, "countStock" integer, "state" "public"."book_state_enum", "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_59136814bde0ec15e9242bf8e05" UNIQUE ("articleNumber"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TYPE "public"."book_state_enum"`);
    }

}

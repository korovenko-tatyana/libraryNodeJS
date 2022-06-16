import {MigrationInterface, QueryRunner} from "typeorm";

export class migration71654760450317 implements MigrationInterface {
    name = 'migration71654760450317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cart_books" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "quantityBook" integer NOT NULL, "cartId" integer, "bookId" integer, CONSTRAINT "PK_c24546d9ee1d3b367f87583f324" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "userIdId" integer, CONSTRAINT "REL_2ea6a897ae31205dd30b400894" UNIQUE ("userIdId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart_books" ADD CONSTRAINT "FK_e0d27bbff3d0dfe69dd1ee323e5" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_books" ADD CONSTRAINT "FK_1f18e6c4c4e3365ebe2206a4698" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_2ea6a897ae31205dd30b4008943" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_2ea6a897ae31205dd30b4008943"`);
        await queryRunner.query(`ALTER TABLE "cart_books" DROP CONSTRAINT "FK_1f18e6c4c4e3365ebe2206a4698"`);
        await queryRunner.query(`ALTER TABLE "cart_books" DROP CONSTRAINT "FK_e0d27bbff3d0dfe69dd1ee323e5"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "cart_books"`);
    }

}

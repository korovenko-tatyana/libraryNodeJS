import { ConfigModule } from "@nestjs/config";

export function pgConfig() {
    ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
    });
    return {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: ['./src/**/*.model.ts', './src/**/*.model.ts'],
        migrations: ['./db/migrations/*.ts'],
        cli: {
            migrationsDir: './db/migrations',
        },
    };
};

export default pgConfig();
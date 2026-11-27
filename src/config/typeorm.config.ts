import { DataSourceOptions } from "typeorm";
import { Livro } from "../livro/livro.entity";
import { Leitor } from "../leitor/leitor.entity";
import { Emprestimo } from "../emprestimo/emprestimo.entity";

export function criarTypeOrmConfig(): DataSourceOptions {
    return {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT) || 5432,
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME || 'biblioteca',
        entities: [Livro, Leitor, Emprestimo],
        synchronize: process.env.NODE_ENV !== 'production',
    };
}
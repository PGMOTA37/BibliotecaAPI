import { Livro } from "../livro.entity";

export const LIVRO_REPOSITORY = Symbol('LIVRO_REPOSITORY');

export interface LivroRepository {
    criar(livro: Livro): Promise<Livro>;
    listar(): Promise<Livro[]>;
    buscarPorId(id: number): Promise<Livro | null>;
    atualizar(livro: Livro): Promise<Livro>;
    remover(livro: Livro): Promise<void>;
    possuiEmprestimos(id: number): Promise<boolean>;
}
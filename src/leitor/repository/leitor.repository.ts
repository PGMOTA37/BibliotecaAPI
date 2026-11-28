import { Leitor } from "../leitor.entity";

export const LEITOR_REPOSITORY = Symbol('LEITOR_REPOSITORY');

export interface LeitorRepository {
    criar(leitor: Leitor): Promise<Leitor>;
    listar(): Promise<Leitor[]>;
    buscarPorId(id: number):Promise<Leitor | null>;
    buscarPorEmail(email: string): Promise<Leitor | null>;
    buscarPorCpf(cpf: string): Promise<Leitor | null>;
    atualizar(leitor: Leitor): Promise<Leitor>;
    possuiEmprestimoAtivo(id: number): Promise<boolean>;
}
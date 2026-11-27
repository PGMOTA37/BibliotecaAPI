import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Livro } from "../livro.entity";
import { LivroRepository } from "./livro.repository";
import { Emprestimo } from "../../emprestimo/emprestimo.entity";

@Injectable()
export class LivroRepositoryTypeOrm implements LivroRepository {
    constructor(
        @InjectRepository(Livro)
        private readonly repo: Repository<Livro>,
        @InjectRepository(Emprestimo)
        private readonly emprestimoRepo: Repository<Emprestimo>,
    ) {}

    criar(livro: Livro): Promise<Livro> {
        return this.repo.save(livro);
    }

    listar(): Promise<Livro[]> {
        return this.repo.find();
    }

    buscarPorId(id: number): Promise<Livro | null> {
        return this.repo.findOneBy({id});
    }

    atualizar(livro: Livro): Promise<Livro> {
        return this.repo.save(livro);
    }

    async remover(livro: Livro): Promise<void> {
        await this.repo.remove(livro);
    }

    possuiEmprestimos(id: number): Promise<boolean> {
        return this.emprestimoRepo.exists({where: {livro: {id}}});
    }
}
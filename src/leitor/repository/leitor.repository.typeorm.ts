import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Leitor } from "../leitor.entity";
import type { LeitorRepository } from "./leitor.repository";
import { Emprestimo, StatusEmprestimo } from "../../emprestimo/emprestimo.entity";

@Injectable()
export class LeitorRepositoryTypeOrm implements LeitorRepository {
    constructor(
        @InjectRepository(Leitor)
        private readonly repo: Repository<Leitor>,

        @InjectRepository(Emprestimo)
        private readonly emprestimoRepo: Repository<Emprestimo>,
    ) {}

    criar(leitor: Leitor): Promise<Leitor> {
        return this.repo.save(leitor);
    }

    listar(): Promise<Leitor[]> {
        return this.repo.find();
    }

    buscarPorId(id: number): Promise<Leitor | null> {
        return this.repo.findOneBy({id});
    }

    buscarPorEmail(email: string): Promise<Leitor | null> {
       return this.repo.findOneBy({email}); 
    }

    buscarPorCpf(cpf: string): Promise<Leitor | null> {
        return this.repo.findOneBy({cpf});
    }

    atualizar(leitor: Leitor): Promise<Leitor> {
        return this.repo.save(leitor);
    }

    possuiEmprestimoAtivo(id: number): Promise<boolean> {
    return this.emprestimoRepo.exists({
        where: { leitor: { id }, status: StatusEmprestimo.ATIVO },
    });
}
}
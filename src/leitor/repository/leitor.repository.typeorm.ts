import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Leitor } from "../leitor.entity";
import type { LeitorRepository } from "./leitor.repository";

@Injectable()
export class LeitorRepositoryTypeOrm implements LeitorRepository {
    constructor(
        @InjectRepository(Leitor)
        private readonly repo: Repository<Leitor>,
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
}
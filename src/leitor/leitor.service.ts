import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Leitor } from "./leitor.entity";
import { CriarLeitorDto } from "./dto/criar-leitor.dto";
import { AtualizarLeitorDto } from "./dto/atualizar-leitor.dto";
import { LEITOR_REPOSITORY } from "./repository/leitor.repository";
import type { LeitorRepository } from "./repository/leitor.repository";

@Injectable()
export class LeitorService {
    constructor(
        @Inject(LEITOR_REPOSITORY)
        private readonly leitorRepository: LeitorRepository
    ) { }

    private async validarDuplicidade(
        email?: string,
        cpf?: string,
        idIgnorado?: number,
    ): Promise<void> {
        if (email !== undefined) {
            const existente = await this.leitorRepository.buscarPorEmail(email)
            if (existente && existente.id !== idIgnorado) {
                throw new ConflictException('E-mail já cadastrado');
            }
        }

        if (cpf !== undefined) {
            const existente = await this.leitorRepository.buscarPorCpf(cpf);
            if (existente && existente.id !== idIgnorado) {
                throw new ConflictException('CPF já cadastrado');
            }
        }
    }

    async criar(dto: CriarLeitorDto): Promise<Leitor> {
        await this.validarDuplicidade(dto.email, dto.cpf);

        const leitor = new Leitor();
        leitor.nome = dto.nome;
        leitor.email = dto.email;
        leitor.cpf = dto.cpf;
        return this.leitorRepository.criar(leitor);
    }

    listar(): Promise<Leitor[]> {
        return this.leitorRepository.listar();
    }

    async buscarPorId(id: number): Promise<Leitor> {
        const leitor = await this.leitorRepository.buscarPorId(id);

        if (!leitor) {
            throw new NotFoundException('Leitor não encontrado!');
        }

        return leitor;
    }

    async atualizar(id: number, dto: AtualizarLeitorDto): Promise<Leitor> {
        const leitor = await this.buscarPorId(id);

        await this.validarDuplicidade(dto.email, dto.cpf, id);

        if (dto.nome !== undefined) leitor.nome = dto.nome;
        if (dto.email !== undefined) leitor.email = dto.email;
        if (dto.cpf !== undefined) leitor.cpf = dto.cpf;

        return this.leitorRepository.atualizar(leitor);
    }

    async inativar(id: number): Promise<Leitor> {
        const leitor = await this.buscarPorId(id);

        if (await this.leitorRepository.possuiEmprestimoAtivo(id)) {
            throw new ConflictException('Leitor possui empréstimo ativo e não pode ser inativado!');
        }

        leitor.ativo = false;
        return this.leitorRepository.atualizar(leitor);
    }
}
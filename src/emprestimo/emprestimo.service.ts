import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Emprestimo, StatusEmprestimo } from "./emprestimo.entity";
import { CriarEmprestimoDto } from "./dto/criar-emprestimo.dto";
import { EMPRESTIMO_REPOSITORY } from "./repository/emprestimo.repository";
import type { EmprestimoRepository } from "./repository/emprestimo.repository";

@Injectable()
export class EmprestimoService {
    constructor(
        @Inject(EMPRESTIMO_REPOSITORY)
        private readonly emprestimoRepository: EmprestimoRepository,
    ) {}

    async criar(dto: CriarEmprestimoDto): Promise<Emprestimo> {
        const livro = await this.emprestimoRepository.buscarLivroPorId(dto.livro_id);

        if(!livro) {
            throw new NotFoundException('Livro não encontrado');
        }

        const leitor = await this.emprestimoRepository.buscarLeitorPorId(dto.leitor_id);

        if(!livro) {
            throw new NotFoundException('Leitor não encontrado!');
        }

        if(!leitor?.ativo) {
            throw new ConflictException('leitor inativo não pode pegar livros emprestados...')
        }

        if(!livro.disponivel) {
            throw new ConflictException('Livro indisponível para empréstimo');
        }

        livro.disponivel = false;
        await this.emprestimoRepository.atualizarLivro(livro);

        const emprestimo = new Emprestimo();
        emprestimo.livro = livro;
        emprestimo.leitor = leitor;
        emprestimo.status = StatusEmprestimo.ATIVO;
        emprestimo.data_devolucao = null;

        return this.emprestimoRepository.criar(emprestimo);
    }

    async buscarPorId(id: number): Promise<Emprestimo> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(id);

        if(!emprestimo) {
            throw new NotFoundException('Empréstimo não encontrado...')
        }

        return emprestimo;
    }

    async devolver(id: number): Promise<Emprestimo> {
        const emprestimo = await this.buscarPorId(id);

        if(emprestimo.status === StatusEmprestimo.DEVOLVIDO) {
            throw new ConflictException('Empréstimo já devolvido');
        }

        emprestimo.status = StatusEmprestimo.DEVOLVIDO;
        emprestimo.data_devolucao = new Date();

        emprestimo.livro.disponivel = true;
        await this.emprestimoRepository.atualizarLivro(emprestimo.livro);

        return this.emprestimoRepository.atualizar(emprestimo);
    }

    listar(): Promise<Emprestimo[]> {
        return this.emprestimoRepository.listar();
    }
}
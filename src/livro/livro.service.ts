import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Livro } from './livro.entity';
import { CriarLivroDto } from './dto/criar-livro.dto';
import { LIVRO_REPOSITORY } from './repository/livro.repository';
import type { LivroRepository } from './repository/livro.repository';
import { AtualizarLivroDto } from './dto/atualizar-livro.dto';

@Injectable()
export class LivroService {
  constructor(
    @Inject(LIVRO_REPOSITORY)
    private readonly livroRepository: LivroRepository,
  ) {}

  criar(dto: CriarLivroDto): Promise<Livro> {
    const livro = new Livro();
    livro.titulo = dto.titulo;
    livro.autor = dto.autor;
    livro.isbn = dto.isbn;
    return this.livroRepository.criar(livro);
  }

  listar(): Promise<Livro[]> {
    return this.livroRepository.listar();
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.livroRepository.buscarPorId(id);

    if(!livro) {
      throw new NotFoundException('Livro não encontrado!');
    }

    return livro;
  }

  async atualizar(id: number, dto: AtualizarLivroDto): Promise<Livro> {
    const livro = await this.buscarPorId(id);

    if(dto.titulo !== undefined) livro.titulo = dto.titulo;
    if(dto.autor !== undefined) livro.autor = dto.autor;
    if(dto.isbn !== undefined) livro.isbn = dto.isbn;

    return this.livroRepository.atualizar(livro);
  }

  async remover(id: number): Promise<void> {
    const livro = await this.buscarPorId(id);

    if(await this.livroRepository.possuiEmprestimos(id)) {
      throw new ConflictException('Livro possui empréstimos e não pode ser removido!');
    }

    await this.livroRepository.remover(livro);
  }
}
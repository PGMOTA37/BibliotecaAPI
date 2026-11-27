import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode } from '@nestjs/common';
import { LivroService } from './livro.service';
import { CriarLivroDto } from './dto/criar-livro.dto';
import { AtualizarLivroDto } from './dto/atualizar-livro.dto';

@Controller('livros')
export class LivroController {
  constructor(private readonly livroService: LivroService) {}

  @Get()
  listar() {
    return this.livroService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.livroService.buscarPorId(id);
  }

  @Post()
  criar(@Body() dto:CriarLivroDto) {
    return this.livroService.criar(dto);
  }

  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarLivroDto) {
    return this.livroService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.livroService.remover(id);
  }
}
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { LeitorService } from "./leitor.service";
import { CriarLeitorDto } from "./dto/criar-leitor.dto";
import { AtualizarLeitorDto } from "./dto/atualizar-leitor.dto";

@Controller('leitores')
export class LeitorController {
    constructor(private readonly leitorService: LeitorService) {}

    @Get()
    listar() {
        return this.leitorService.listar();
    }

    @Get(':id')
    buscarPorId(@Param('id', ParseIntPipe) id: number) {
        return this.leitorService.buscarPorId(id);
    }

    @Post()
    criar(@Body() dto: CriarLeitorDto) {
        return this.leitorService.criar(dto);
    }

    @Put(':id')
    atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarLeitorDto) {
        return this.leitorService.atualizar(id, dto);
    }

    @Delete(':id')
    inativar(@Param('id', ParseIntPipe) id: number) {
        return this.leitorService.inativar(id);
    }
}
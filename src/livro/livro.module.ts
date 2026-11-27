import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livro } from './livro.entity';
import { LivroService } from './livro.service';
import { LivroController } from './livro.controller';
import { LIVRO_REPOSITORY } from './repository/livro.repository';
import { LivroRepositoryTypeOrm } from './repository/livro.repository.typeorm';
import { Emprestimo } from '../emprestimo/emprestimo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Livro, Emprestimo])],
  controllers: [LivroController],
  providers: [
    LivroService,
    { provide: LIVRO_REPOSITORY, useClass: LivroRepositoryTypeOrm },
  ],
})

export class LivroModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emprestimo } from './emprestimo.entity';
import { Livro } from '../livro/livro.entity';
import { EmprestimoService } from './emprestimo.service';
import { EmprestimoController } from './emprestimo.controller';
import { EMPRESTIMO_REPOSITORY } from './repository/emprestimo.repository';
import { EmprestimoRepositoryTypeOrm } from './repository/emprestimo.repository.typeorm';
import { Leitor } from '../leitor/leitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emprestimo, Livro, Leitor])],
  controllers: [EmprestimoController],
  providers: [
    EmprestimoService,
    { provide: EMPRESTIMO_REPOSITORY, useClass: EmprestimoRepositoryTypeOrm },
  ],
})

export class EmprestimoModule {}
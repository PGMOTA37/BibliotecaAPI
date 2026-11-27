import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LivroModule } from "./livro/livro.module";
import { EmprestimoModule } from "./emprestimo/emprestimo.module";
import { LeitorModule } from "./leitor/leitor.module";
import { criarTypeOrmConfig } from "./config/typeorm.config";

@Module ({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(criarTypeOrmConfig()),
    LivroModule,
    EmprestimoModule,
    LeitorModule,
  ],
})

export class AppModule{}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Leitor } from "./leitor.entity";
import { LeitorService } from "./leitor.service";
import { LeitorController } from "./leitor.controller";
import { LEITOR_REPOSITORY } from "./repository/leitor.repository";
import { LeitorRepositoryTypeOrm } from "./repository/leitor.repository.typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Leitor])],
    controllers: [LeitorController],
    providers: [
        LeitorService,
        { provide: LEITOR_REPOSITORY, useClass: LeitorRepositoryTypeOrm },
    ],
})

export class LeitorModule{}
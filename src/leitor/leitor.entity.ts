import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('leitores')
export class Leitor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({unique:true})
    email: string;

    @Column({unique:true})
    cpf: string;

    @Column({default: true})
    ativo: boolean;
}
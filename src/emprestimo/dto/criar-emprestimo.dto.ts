import { IsInt } from "class-validator";

export class CriarEmprestimoDto {
    @IsInt()
    livro_id: number;

    @IsInt()
    leitor_id: number;
}
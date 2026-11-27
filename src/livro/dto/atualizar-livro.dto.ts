import { IsNotEmpty, IsOptional, IsString, isString } from "class-validator";

export class AtualizarLivroDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    titulo?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    autor?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    isbn?: string;
}
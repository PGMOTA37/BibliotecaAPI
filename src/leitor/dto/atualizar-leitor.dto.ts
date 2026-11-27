import { IsEmail, IsNotEmpty, IsString, IsOptional, Matches } from "class-validator";

export class AtualizarLeitorDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @Matches(/^\d{11}$/, {message: 'o cpf deve conter 11 dígitos'})
    cpf: string;
}
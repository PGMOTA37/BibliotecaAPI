import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CriarLeitorDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEmail()
    email: string;

    @Matches(/^\d{11}$/, {message: 'o cpf deve conter 11 dígitos'})
    cpf: string;
}
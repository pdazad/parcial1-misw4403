/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';

export class SupermercadoDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsUrl()
    @IsNotEmpty()
    readonly paginaWeb: string;

    @IsNumber()
    @IsNotEmpty()
    readonly latitud: number;

    @IsNumber()
    @IsNotEmpty()
    readonly longitud: number;

}

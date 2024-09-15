/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CiudadDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly pais: string;

    @IsNumber()
    @IsNotEmpty()
    readonly habitantes: number;

}

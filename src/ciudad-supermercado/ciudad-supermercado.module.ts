/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { CiudadService } from '../ciudad/ciudad.service';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity]),
  ],
  providers: [
    SupermercadoService,
    CiudadService,
    CiudadSupermercadoService,
  ],
  controllers: [CiudadSupermercadoController],
})
export class CiudadSupermercadoModule {}

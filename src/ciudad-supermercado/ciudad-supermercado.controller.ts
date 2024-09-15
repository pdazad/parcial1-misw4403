/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
  import { CiudadSupermercadoService } from './ciudad-supermercado.service';
  import { plainToInstance } from 'class-transformer';
  import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
  import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';

  
  @UseInterceptors(BusinessErrorsInterceptor)
  @Controller('ciudades')
  export class CiudadSupermercadoController {
    constructor(
      private readonly ciudadSupermercadoService: CiudadSupermercadoService,
    ) {}
  
    @Post(':ciudadId/supermercados/:supermercadoId')
    async addSupermarketToCity(
      @Param('ciudadId') ciudadId: string,
      @Param('supermercadoId') supermercadoId: string,
    ) {
      return await this.ciudadSupermercadoService.addSupermarketToCity(
        ciudadId,
        supermercadoId,
      );
    }
  
    @Get(':ciudadId/supermercados/:supermercadoId')
    async findSupermarketFromCity(
      @Param('ciudadId') ciudadId: string,
      @Param('supermercadoId') supermercadoId: string,
    ) {
      return await this.ciudadSupermercadoService.findSupermarketFromCity(
        ciudadId,
        supermercadoId,
      );
    }
  
    @Get(':ciudadId/supermercados')
    async findSupermarketsFromCity(
      @Param('ciudadId') ciudadId: string,
    ) {
      return await this.ciudadSupermercadoService.findSupermarketsFromCity(
        ciudadId,
      );
    }
  
    @Put(':ciudadId/supermercados')
    async updateSupermarketsFromCity(
      @Param('ciudadId') ciudadId: string,
      @Body() supermercadosDto: SupermercadoDto[],
    ) {
      const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto);
      return await this.ciudadSupermercadoService.updateSupermarketsFromCity(
        ciudadId,
        supermercados,
      );
    }
  
    @Delete(':ciudadId/supermercados/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(
      @Param('ciudadId') ciudadId: string,
      @Param('supermercadoId') supermercadoId: string,
    ) {
      return await this.ciudadSupermercadoService.deleteSupermarketFromCity(
        ciudadId,
        supermercadoId,
      );
    }
  }
  
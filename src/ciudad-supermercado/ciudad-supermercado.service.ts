/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { CiudadService } from '../ciudad/ciudad.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    private readonly supermercadoService: SupermercadoService,
    private readonly ciudadService: CiudadService,
  ) {}

  // Método para agregar un supermercado a una ciudad
  async addSupermarketToCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<CiudadEntity> {
    const ciudad = await this.ciudadService.findOne(ciudadId);
    const supermercado = await this.supermercadoService.findOne(supermercadoId);

    // Agregar el supermercado a la lista de supermercados de la ciudad
    ciudad.supermercados = [...ciudad.supermercados, supermercado];
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  // Método para encontrar un supermercado en una ciudad específica
  async findSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<SupermercadoEntity> {
    const ciudad: CiudadEntity = await this.ciudadService.findOne(ciudadId);
    const supermercadoFound = ciudad.supermercados.find(
      (supermercado: SupermercadoEntity) => supermercado.id === supermercadoId,
    );

    if (!supermercadoFound) {
      throw new BusinessLogicException(
        'The supermarket with the given id is not associated to the city',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return supermercadoFound;
  }

  // Método para obtener todos los supermercados de una ciudad
  async findSupermarketsFromCity(
    ciudadId: string,
  ): Promise<SupermercadoEntity[]> {
    const ciudad: CiudadEntity = await this.ciudadService.findOne(ciudadId);
    return ciudad.supermercados;
  }

  // Método para asociar varios supermercados a una ciudad
  async updateSupermarketsFromCity(
    ciudadId: string,
    supermercados: SupermercadoEntity[],
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadService.findOne(ciudadId);

    for (const supermercado of supermercados) {
      await this.supermercadoService.findOne(supermercado.id);
    }

    // Actualizar la lista de supermercados en la ciudad
    ciudad.supermercados = supermercados;
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  // Método para eliminar un supermercado de una ciudad
  async deleteSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<void> {
    const ciudad = await this.ciudadService.findOne(ciudadId);
    const supermercadoFound = ciudad.supermercados.find(
      (supermercado: SupermercadoEntity) => supermercado.id === supermercadoId,
    );

    if (!supermercadoFound) {
      throw new BusinessLogicException(
        'The supermarket with the given id is not associated to the city',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Remover el supermercado de la ciudad
    ciudad.supermercados = ciudad.supermercados.filter(
      (supermercado: SupermercadoEntity) => supermercado.id !== supermercadoId,
    );
    await this.ciudadService.update(ciudadId, ciudad);
  }
}

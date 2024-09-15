/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({
      relations: ['ciudades'],
    });
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const supermercado = await this.supermercadoRepository.findOne({
      where: { id },
      relations: ['ciudades'],
    });
    if (!supermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return supermercado;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    // Validar que el nombre tenga más de 10 caracteres
    if (supermercado.nombre.length <= 10) {
      throw new BusinessLogicException(
        'The name of the supermarket must be longer than 10 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.supermercadoRepository.save(supermercado);
  }

  async update(
    id: string,
    supermercado: SupermercadoEntity,
  ): Promise<SupermercadoEntity> {
    const persistedSupermercado = await this.supermercadoRepository.findOne({
      where: { id },
    });
    if (!persistedSupermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    // Validar que el nombre tenga más de 10 caracteres
    if (supermercado.nombre.length <= 10) {
      throw new BusinessLogicException(
        'The name of the supermarket must be longer than 10 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.supermercadoRepository.save({
      ...persistedSupermercado,
      ...supermercado,
    });
  }

  async delete(id: string): Promise<void> {
    const supermercado = await this.supermercadoRepository.findOne({
      where: { id },
    });
    if (!supermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.supermercadoRepository.remove(supermercado);
  }
}

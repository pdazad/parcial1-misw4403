/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
  private readonly validCountries = ['Argentina', 'Ecuador', 'Paraguay'];

  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({
      relations: ['supermercados'],
    });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    // Validar que el país esté en la lista permitida
    if (!this.validCountries.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        `The country ${ciudad.pais} is not allowed. Only Argentina, Ecuador, and Paraguay are valid.`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const persistedCiudad = await this.ciudadRepository.findOne({ where: { id } });
    if (!persistedCiudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    // Validar que el país esté en la lista permitida
    if (!this.validCountries.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        `The country ${ciudad.pais} is not allowed. Only Argentina, Ecuador, and Paraguay are valid.`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.ciudadRepository.save({
      ...persistedCiudad,
      ...ciudad,
    });
  }

  async delete(id: string): Promise<void> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.ciudadRepository.remove(ciudad);
  }
}

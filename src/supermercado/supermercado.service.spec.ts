/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await repository.save({
          nombre: faker.company.name(),
          paginaWeb: faker.internet.url(),
          latitud: faker.location.latitude(),
          longitud: faker.location.longitude(),
          ciudades: [],
        });
      supermercadosList.push(supermercado);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermercados', async () => {
    const supermercados: SupermercadoEntity[] =
      await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermercado by id', async () => {
    const storedSupermercado: SupermercadoEntity =
      supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(
      storedSupermercado.id,
    );
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre);
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb);
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud);
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud);

  });

  it('findOne should throw an exception for an invalid supermercado', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('create should return a new supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: 'Supermercado Nuevo', // Nombre con más de 10 caracteres
      paginaWeb: faker.internet.url(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      ciudades: [],
    };
  
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();
  
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: newSupermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
  });
  

  it('create should throw an exception for a supermarket name with less than 10 characters', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: 'Short', // Nombre con menos de 10 caracteres
      paginaWeb: faker.internet.url(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      ciudades: [],
    };
  
    await expect(service.create(supermercado)).rejects.toHaveProperty(
      'message',
      'The name of the supermarket must be longer than 10 characters',
    );
  });
  

  it('update should modify a supermercado with valid name', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = 'Supermercado Actualizado'; // Nombre con más de 10 caracteres
    supermercado.paginaWeb = 'New description';
    supermercado.latitud = faker.location.latitude();
    supermercado.longitud = faker.location.longitude();
  
    const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();
  
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
  });
  

  it('update should throw an exception for an invalid supermercado', async () => {
    let supermercado: SupermercadoEntity =
      supermercadosList[0];
    supermercado = {
      ...supermercado,
      nombre: 'New name',
      paginaWeb: 'New description',
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
    };
    await expect(() =>
      service.update('0', supermercado),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('update should throw an exception for a supermarket name with less than 10 characters', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = 'Short'; // Nombre con menos de 10 caracteres
  
    await expect(service.update(supermercado.id, supermercado)).rejects.toHaveProperty(
      'message',
      'The name of the supermarket must be longer than 10 characters',
    );
  });
  

  it('delete should remove a supermercado', async () => {
    const supermercado: SupermercadoEntity =
      supermercadosList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity =
      await repository.findOne({
        where: { id: supermercado.id },
      });
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermercado', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
});

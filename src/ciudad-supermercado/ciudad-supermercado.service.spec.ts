/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { CiudadService } from '../ciudad/ciudad.service';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        CiudadSupermercadoService,
        SupermercadoService,
        CiudadService,
      ],
    }).compile();

    service = module.get<CiudadSupermercadoService>(
      CiudadSupermercadoService,
    );
    supermercadoRepository = module.get<
      Repository<SupermercadoEntity>
    >(getRepositoryToken(SupermercadoEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();

    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.company.name(),
        paginaWeb: faker.internet.url(),
        latitud: faker.location.latitude(),
        longitud: faker.location.longitude(),
      });
      supermercadosList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Argentina', // País permitido
      habitantes: 4800000,
      supermercados: supermercadosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add a supermarket to a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      paginaWeb: faker.internet.url(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
    });

    const result: CiudadEntity = await service.addSupermarketToCity(
      ciudad.id,
      newSupermercado.id,
    );

    expect(result.supermercados.length).toBe(6); // Ya había 5 supermercados en la ciudad
    expect(result.supermercados.find(s => s.id === newSupermercado.id)).not.toBeNull();
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      paginaWeb: faker.internet.url(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
    });

    await expect(() =>
      service.addSupermarketToCity('0', newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('addSupermarketToCity should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.addSupermarketToCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('findSupermarketFromCity should return supermarket by city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity =
      await service.findSupermarketFromCity(ciudad.id, supermercado.id);

    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketFromCity('0', supermercadosList[0].id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('findSupermarketsFromCity should return supermarkets by city', async () => {
    const supermercados: SupermercadoEntity[] =
      await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5);
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('updateSupermarketsFromCity should update supermarket list for a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      paginaWeb: faker.internet.url(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
    });

    const updatedCity: CiudadEntity = await service.updateSupermarketsFromCity(
      ciudad.id,
      [newSupermercado],
    );
    expect(updatedCity.supermercados.length).toBe(1);
    expect(updatedCity.supermercados[0].nombre).toBe(newSupermercado.nombre);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      paginaWeb: faker.internet.url(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
    });

    await expect(() =>
      service.updateSupermarketsFromCity('0', [newSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const invalidSupermercado: SupermercadoEntity = supermercadosList[0];
    invalidSupermercado.id = '0';

    await expect(() =>
      service.updateSupermarketsFromCity(ciudad.id, [invalidSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should remove a supermarket from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];

    await service.deleteSupermarketFromCity(
      ciudad.id,
      supermercado.id,
    );

    const storedCity: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });
    const deletedSupermercado: SupermercadoEntity =
      storedCity.supermercados.find(s => s.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercadosList[0].id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should throw an exception for a non-associated supermarket', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      paginaWeb: faker.internet.url(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
    });

    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });
});

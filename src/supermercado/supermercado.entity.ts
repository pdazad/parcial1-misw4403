/* eslint-disable prettier/prettier */
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class SupermercadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;
    
    @Column()
    paginaWeb: string;

    @Column()
    latitud: number;

    @Column()
    longitud: number;

    @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
    ciudades: CiudadEntity[];


}

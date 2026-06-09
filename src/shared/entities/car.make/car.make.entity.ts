import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from '../car-model/car-model.entity'; 

@Entity('car_makes')
export class CarMake {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  title: string;

  @OneToMany(() => CarModel, (model) => model.carMake, { lazy: true })
  carModels: Promise<CarModel[]>;
}

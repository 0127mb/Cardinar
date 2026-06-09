import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarMake } from '../car.make/car.make.entity';
import { Articul } from '../articul/articul.entity'; 

@Entity('car_models')
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carMakeId: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  title: string;

  @ManyToOne(() => CarMake, (make) => make.carModels, { lazy: true })
  @JoinColumn({ name: 'carMakeId' })
  carMake: Promise<CarMake>;

  @OneToMany(() => Articul, (articul) => articul.carModel, { lazy: true })
  articuls: Promise<Articul[]>;
}

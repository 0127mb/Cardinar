import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryType, CustomModel } from '../custom-model/custom-model.entity';
import { CarMake } from '../car.make/car.make.entity';
import { CarModel } from '../car-model/car-model.entity';


@Entity('custom_products')
export class CustomProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  fullName: string;

  @Column({ type: 'varchar', length: 16 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string;

  @Column()
  carMakeId: number;

  @Column()
  carModelId: number;

  @Column({ type: 'enum', enum: CategoryType })
  category: CategoryType;

  @Column()
  modelId: number;

  @Column({ type: 'bool' })
  withLogo: boolean;

  @Column({ type: 'varchar', length: 256 })
  image: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @ManyToOne(() => CarMake)
  @JoinColumn({ name: 'carMakeId' })
  carMake: CarMake;

  @ManyToOne(() => CarModel)
  @JoinColumn({ name: 'carModelId' })
  carModel: CarModel;

  @ManyToOne(() => CustomModel)
  @JoinColumn({ name: 'modelId' })
  model: CustomModel;
}

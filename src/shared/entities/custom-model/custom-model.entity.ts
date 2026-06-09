import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryType {
  COVER = 'cover',
  CARPET = 'carpet',
}

@Entity('custom_models')
export class CustomModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CategoryType })
  category: CategoryType;

  @Column({ type: 'varchar', length: 128, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 256 })
  image: string;
}

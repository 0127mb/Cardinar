import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', length: 256 })
  image: string;

  @Column({ type: 'bool' })
  isActive: boolean;
}

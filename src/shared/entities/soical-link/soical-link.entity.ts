import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('social_links')
export class SocialLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  title: string;

  @Column({ type: 'varchar', length: 256, unique: true })
  link: string;

  @Column({ type: 'varchar', length: 128 })
  icon: string;
}

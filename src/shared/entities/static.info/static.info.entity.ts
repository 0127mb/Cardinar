import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TranslationStaticInfo } from '../translation-static-info/translation-static-info.entity';

@Entity('static_info')
export class StaticInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  address: string;

  @Column({ type: 'varchar', length: 16 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  workingHours?: string;

  @Column({ type: 'varchar', length: 64 })
  email: string;

  @OneToMany(
    () => TranslationStaticInfo,
    (translation) => translation.staticInfo,
    { lazy: true },
  )
  translations: Promise<TranslationStaticInfo[]>;
}

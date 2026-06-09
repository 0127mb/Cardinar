import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StaticInfo } from '../static.info/static.info.entity';
import { Language } from '../translation/translation.entity';

@Entity('translation_static_info')
export class TranslationStaticInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Language, nullable: true })
  lang?: Language;

  @Column({ nullable: true })
  staticInfoId?: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  headerTitle?: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  subNavbarTitle?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  navCatalog?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  navConstructor?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  navBranches?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  navContacts?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  footerInformationTitle?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  footerPhoneTitle?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  footerEmailTitle?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  footerAddressTitle?: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  requestTitle?: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  requestDescription?: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  address?: string;

  @ManyToOne(() => StaticInfo, (staticInfo) => staticInfo.translations, {
    nullable: true,
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staticInfoId' })
  staticInfo?: Promise<StaticInfo>;
}

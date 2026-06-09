import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Banner } from '../banner/banner.entity';
import { Branch } from '../branch/branch.entity';
import { CarModel } from '../car-model/car-model.entity';
import { CarMake } from '../car.make/car.make.entity';
import { Category } from '../category/category.entity';
import { Color } from '../color/color.entity';
import { CustomModel } from '../custom-model/custom-model.entity';
import { Material } from '../material/material.entity';
import { Part } from '../part/part.entity';
import { Product } from '../product/product.entity';
import { SocialLink } from '../soical-link/soical-link.entity';

export enum Language {
  UZ = 'uz',
  RU = 'ru',
}

@Entity('products_translation')
export class ProductsTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Language })
  lang: Language;

  @Column({ type: 'varchar', length: 64 })
  type: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  productId?: number;

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  materialId?: number;

  @Column({ nullable: true })
  branchId?: number;

  @Column({ nullable: true })
  carMakeId?: number;

  @Column({ nullable: true })
  carModelId?: number;

  @Column({ nullable: true })
  colorId?: number;

  @Column({ nullable: true })
  partId?: number;

  @Column({ nullable: true })
  bannerId?: number;

  @Column({ nullable: true })
  socialLinkId?: number;

  @Column({ nullable: true })
  customModelId?: number;

  @ManyToOne(() => Product, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product?: Promise<Product>;

  @ManyToOne(() => Category, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category?: Promise<Category>;

  @ManyToOne(() => Material, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'materialId' })
  material?: Promise<Material>;

  @ManyToOne(() => Branch, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch?: Promise<Branch>;

  @ManyToOne(() => CarMake, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carMakeId' })
  carMake?: Promise<CarMake>;

  @ManyToOne(() => CarModel, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carModelId' })
  carModel?: Promise<CarModel>;

  @ManyToOne(() => Color, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'colorId' })
  color?: Promise<Color>;

  @ManyToOne(() => Part, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partId' })
  part?: Promise<Part>;

  @ManyToOne(() => Banner, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bannerId' })
  banner?: Promise<Banner>;

  @ManyToOne(() => SocialLink, { nullable: true, lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'socialLinkId' })
  socialLink?: Promise<SocialLink>;

  @ManyToOne(() => CustomModel, {
    nullable: true,
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customModelId' })
  customModel?: Promise<CustomModel>;
}

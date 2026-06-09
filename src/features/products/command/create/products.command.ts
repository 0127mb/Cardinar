import { CreateProductDto } from '../../dto/products.dto';

export class CreateProductCommand {
  constructor(public readonly dto: CreateProductDto) {}
}

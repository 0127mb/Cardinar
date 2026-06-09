import { UpdateProductDto } from '../../dto/products.dto';

export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateProductDto,
  ) {}
}

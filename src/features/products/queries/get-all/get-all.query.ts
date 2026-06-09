import { ProductFilterDto } from '../../dto/product.filters';

export class GetAllProductsQuery {
  constructor(public readonly filter: ProductFilterDto) {}
}

export class CreateProductColorCommand {
  constructor(
    readonly productId: number,
    readonly colorId: number,
  ) {}
}

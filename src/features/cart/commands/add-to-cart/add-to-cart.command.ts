export class AddToCartCommand {
  constructor(
    readonly productId: number,
    readonly articulId: number,
    readonly quantity: number = 1,
  ) {}
}

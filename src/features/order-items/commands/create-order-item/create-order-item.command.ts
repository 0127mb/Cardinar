export class CreateOrderItemCommand {
  constructor(
    readonly orderId: number,
    readonly productId: number,
    readonly articulId: number,
    readonly quantity: number = 1,
  ) {}
}

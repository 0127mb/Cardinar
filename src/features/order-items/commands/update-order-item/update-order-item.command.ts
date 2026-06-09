export class UpdateOrderItemCommand {
  constructor(
    readonly id: number,
    readonly quantity?: number,
  ) {}
}

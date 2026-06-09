export class UpdateCartItemCommand {
  constructor(
    readonly id: number,
    readonly quantity: number,
  ) {}
}

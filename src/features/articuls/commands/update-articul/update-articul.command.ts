export class UpdateArticulCommand {
  constructor(
    readonly id: number,
    readonly productId?: number,
    readonly carModelId?: number,
  ) {}
}

export class CreateArticulCommand {
  constructor(
    readonly productId: number,
    readonly carModelId: number,
  ) {}
}

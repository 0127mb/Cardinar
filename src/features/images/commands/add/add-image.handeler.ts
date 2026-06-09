export class AddImageCommand {
  constructor(
    public readonly productId: number,
    public readonly filename: string,
    public readonly position?: number,
  ) {}
}

export class AddImageCommand {
  constructor(
    public readonly productId: number,
    public readonly imageUrl: string,
    public readonly position?: number,
  ) {}
}

export class UpdateCarModelCommand {
  constructor(
    public readonly id: number,
    public readonly title?: string,
    public readonly carMakeId?: number,
  ) {}
}

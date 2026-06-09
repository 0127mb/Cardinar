export class CreateCarModelCommand {
  constructor(
    public readonly title: string,
    public readonly carMakeId: number,
  ) {}
}

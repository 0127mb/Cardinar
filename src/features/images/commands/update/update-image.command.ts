export class UpdateImagePositionCommand {
  constructor(
    public readonly id: number,
    public readonly position: number,
  ) {}
}

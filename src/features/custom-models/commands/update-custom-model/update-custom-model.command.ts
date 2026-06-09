
export class UpdateCustomModelCommand {
  constructor(
    readonly id: number,

    readonly title?: string,
    readonly image?: string,
  ) {}
}

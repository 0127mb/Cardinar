export class CreateRequestCommand {
  constructor(
    readonly userId: number | undefined,
    readonly fullName: string,
    readonly phoneNumber: string,
    readonly email: string | null | undefined,
    readonly comments: string | undefined,
  ) {}
}

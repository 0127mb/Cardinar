export class RegisterCommand {
  constructor(
    public readonly fullName: string,
    public readonly phoneNumber: string,
    public readonly password: string,
  ) {}
}

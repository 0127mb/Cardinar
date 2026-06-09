export class RegisterCommand {
  constructor(
    public readonly fullName: string,
    public readonly phoneNumber: string,
    public readonly email: string,
    public readonly password: string,
    public readonly isAdmin: boolean,
    public readonly isActive: boolean,
  ) {}
}

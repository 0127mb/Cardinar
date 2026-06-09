export class CreateUserCommand {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly password: string,
    public readonly isAdmin: boolean = false,
    public readonly isActive: boolean = true,
  ) { }
}

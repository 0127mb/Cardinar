export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly fullName?: string,
    public readonly password?: string,
    public readonly phoneNumber?: string,
    public readonly isAdmin?: boolean,
    public readonly isActive?: boolean,
  ) {}
}

export class GetUserQuery {
  constructor(
    public readonly id?: number,
    public readonly fullName?: string,
    public readonly email?: string,
    public readonly phoneNumber?: string,
  ) {}
}

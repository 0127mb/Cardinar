export class VerifyOtpCommand {
  constructor(
    public readonly token: string,
    public readonly type: string,
  ) {}
}

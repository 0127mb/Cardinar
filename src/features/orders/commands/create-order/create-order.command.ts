import { ICommand } from '@nestjs/cqrs';
import { paymentMethod } from '../../../../shared/enums/paymendMethod.enum';

export class CreateOrderCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly branchId: number,
    public readonly fullName: string,
    public readonly phoneNumber: string,
    public readonly email: string | null,
    public readonly delivery: boolean,
    public readonly paymentMethod: paymentMethod,
    public readonly items: Array<{
      productId: number;
      articulId: number;
      quantity: number;
    }>,
  ) {}
}

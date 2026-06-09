import { ICommand } from '@nestjs/cqrs';
import { orderStatus } from '../../../../shared/enums/orderStatus.enum'; 

export class UpdateOrderStatusCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly status: orderStatus,
  ) {}
}

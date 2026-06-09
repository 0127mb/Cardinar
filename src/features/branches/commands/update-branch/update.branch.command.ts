import { UpdateBranchDto } from '../../dto/branches.dto';

export class UpdateBranchCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBranchDto,
  ) {}
}

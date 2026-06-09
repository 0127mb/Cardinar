import { branchType } from '../../../../shared/enums/brachtype.enum';
import { CreateBranchDto } from '../../dto/branches.dto';

export class CreateBranchCommand {
  constructor(
    public readonly title: string,
    public readonly address: string,
    public readonly phoneNumber: string,
    public readonly longitude: number,
    public readonly latitude: number,
    public readonly branchType: branchType,
    public readonly district?: string,
    public readonly region?: string,
    public readonly isActive?: boolean,
  ) { }
}

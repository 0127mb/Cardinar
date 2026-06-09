import { CategoryType } from '../../../../shared/entities/custom-model/custom-model.entity';
import { part as PartType } from '../../../../shared/enums/part.enum';

export class CreatePartCommand {
  constructor(
    readonly category: CategoryType,
    readonly part: PartType,
    readonly title: string | null,
    readonly materialId: number,
    readonly colorId: number,
    readonly image: string,
  ) {}
}

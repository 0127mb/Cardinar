import { CategoryType } from '../../../../shared/entities/custom-model/custom-model.entity';
import { part as PartType } from '../../../../shared/enums/part.enum';

export class UpdatePartCommand {
  constructor(
    readonly id: number,
    readonly category?: CategoryType,
    readonly part?: PartType,
    readonly title?: string,
    readonly materialId?: number,
    readonly colorId?: number,
    readonly image?: string,
  ) {}
}

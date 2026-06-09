import { CategoryType } from "../../../../shared/entities/custom-model/custom-model.entity";

export class CreateCustomModelCommand {
  constructor(
    public readonly category: CategoryType,
    public readonly title: string,
    public readonly image: string,
  ) {}
}

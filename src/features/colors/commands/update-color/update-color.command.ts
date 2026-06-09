import { CreateColorDto } from '../../dto/color.dto';

export class UpdateColorCommand {
  constructor(
    public readonly id: number,
    public readonly dto: Partial<CreateColorDto>,
  ) {}
}

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateStaticInfoCommand } from "./static.command";
import { InjectRepository } from "@nestjs/typeorm";
import { StaticInfo } from "../../../../shared/entities/static.info/static.info.entity";
import { Repository } from "typeorm";
import { TranslationStaticInfo } from "../../../../shared/entities/translation-static-info/translation-static-info.entity";

@CommandHandler(CreateStaticInfoCommand)
export class CreateStaticInfoCommandHandler implements ICommandHandler<CreateStaticInfoCommand> {
    constructor(@InjectRepository(StaticInfo)
    private readonly repo: Repository<StaticInfo>,
    @InjectRepository(TranslationStaticInfo)
    private readonly translationRepo: Repository<TranslationStaticInfo>) { }
    async execute(command: CreateStaticInfoCommand): Promise<any> {
        const staticInfo =  this.repo.create({
            address: command.address,
            phoneNumber: command.phoneNumber,
            workingHours: command.workingHours,
            email: command.email,
        })
        const savedStaticInfo = await this.repo.save(staticInfo)

        if (command.translations?.length) {
            const translations = command.translations.map((translation) =>
                this.translationRepo.create({
                    ...translation,
                    staticInfoId: savedStaticInfo.id,
                }),
            );
            await this.translationRepo.save(translations);
        }

        return staticInfo

    }
}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticInfo } from '../../shared/entities/static.info/static.info.entity'; 
import { TranslationStaticInfo } from '../../shared/entities/translation-static-info/translation-static-info.entity';
import { StaticInfoController } from './controller/static-info.controller';
import { UpdateStaticInfoHandler } from './commands/update-static-info/update-static-info.handler';
import { GetStaticInfoHandler } from './queries/get-static-info/get-static-info.handler';
import { CreateStaticInfoCommandHandler } from './commands/create-static-info/static.handler';
import { GetTranslationStaticInfoHandler } from './queries/get-translation-static-info/get-translation-static-info.handler';

const CommandHandlers = [UpdateStaticInfoHandler,CreateStaticInfoCommandHandler];
const QueryHandlers = [GetStaticInfoHandler, GetTranslationStaticInfoHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([StaticInfo, TranslationStaticInfo]),
  ],
  controllers: [StaticInfoController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class StaticInfoModule {}

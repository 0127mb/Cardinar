import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user/user.entity'; 
import { UsersController } from './controller/user.controller';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler';
import { GetUserHandler } from './commands/get-users-by-information/get-users.handler';
import { GetAllUsersHandler } from './commands/get-all-users/get-all-users.handler';
import { UpdateProfileImageHandler } from './commands/update-profile-image/update-profile-image.handler';
const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  UpdateProfileImageHandler,
  DeleteUserHandler,
];
const QueryHandlers = [GetUserHandler, GetAllUsersHandler];
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class UsersModule {}

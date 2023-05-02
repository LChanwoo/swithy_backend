import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Boards } from '../entities/board.entity';
import { Bookmarks } from '../entities/bookmark.entity';
import { Comments } from '../entities/comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Users,
            Boards,
            Bookmarks,
            Comments
        ]),
    ],
    controllers: [
        UserController,
    ],
    providers: [
        UserService,
    ],
})
export class UserModule { }

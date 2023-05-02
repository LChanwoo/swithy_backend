import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from '../entities/board.entity';
import { Tags } from '../entities/tag.entity';
import { BoardTagMap } from '../entities/board_tag_map.entity';
import { Comments } from '../entities/comment.entity';
import { Likes } from '../entities/like.entity';
import { Bookmarks } from '../entities/bookmark.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Boards,
            Tags,
            BoardTagMap,
            Comments,
            Likes,
            Bookmarks
        ])
    ],
    controllers: [
        BoardController,],
    providers: [
        BoardService,],
})
export class BoardModule { }

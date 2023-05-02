
import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { query } from 'express';
import { C_BoardCategory } from '../common/constant/board_category.constant';
import { User } from '../common/decorators/user.decorator';
import { LoggedInGuard } from '../common/guards/logged-in.guard';
import { Users } from '../entities/user.entity';
import { BoardService } from './board.service';

@Controller('v1/api/board')
export class BoardController {
    constructor(
        private readonly boardService: BoardService,
    ) {}
    
    @Get('/search')
    async searchBoard(
        @Query('page') page: number,
        @Query('pagesize') pageSize: number,
        @Query('keyword') keyword: string,
        @Query('category') category: string,
        @Query('hot') hot: number,
        @Query('sort') sort: string,
        @Query('tag') tag: string,
        ) {
            if(!C_BoardCategory[category.toUpperCase()]) throw new HttpException('카테고리가 잘못되었습니다.',400);

            const tags = tag?.split(',');
            return await this.boardService.searchBoard(
                keyword,
                page,
                pageSize,
                C_BoardCategory[category.toUpperCase()],
                hot,
                tags
            );
    }
    @Get('/notice')
    async getNotice(@Query('page') page: any,@Query('pagesize') pageSize: any) {
        return await this.getNotice(page,pageSize);
    }
    @Get('/notice/:id')
    async getNoticeById(@Param('id') id: any) {
        return await this.getNoticeById(id);
    }
    @Post('/notice')
    async createNotice(@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.createBoard(body,user,C_BoardCategory.NOTICE);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    @Patch('/notice/:id')
    async updateNotice(@Param('id') id: any,@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.updateBoard(id,body,user,C_BoardCategory.NOTICE);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
    @Delete('/notice/:id')
    async deleteNotice(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.deleteBoard(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Get('/free')
    async getFree(@Query('page') page: any,@Query('pagesize') pageSize: any, @Query('hot') hot: number = 0) {
        return this.boardService.getBoard(C_BoardCategory.FREE,page,pageSize,hot);
    }

    @Get('/free/:id')
    async getFreeById(@Param('id') id: any) {
        return this.boardService.getBoardById(id,C_BoardCategory.FREE);
    }

    @Post('/free')
    @UseGuards(LoggedInGuard)
    async createFree(@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.createBoard(body,user,C_BoardCategory.FREE);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Patch('/free/:id')
    @UseGuards(LoggedInGuard)
    async updateFree(@Param('id') id: any,@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.updateBoard(id,body,user,C_BoardCategory.FREE);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Delete('/free/:id')
    @UseGuards(LoggedInGuard)
    async deleteFree(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.deleteBoard(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Get('/photo')
    async getPhoto(@Query('page') page: any,@Query('pagesize') pageSize: any, @Query('hot') hot: number = 0) {
        return this.boardService.getPhoto(page,pageSize,hot);
    }

    @Get('/photo/:id')
    async getPhotoById(@Param('id') id: any) {
        return this.boardService.getPhotoById(id);
    }

    @Post('/photo')
    @UseGuards(LoggedInGuard)
    async createPhoto(@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.createBoard(body,user,C_BoardCategory.PHOTO);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Patch('/photo/:id')
    @UseGuards(LoggedInGuard)
    async updatePhoto(@Param('id') id: any,@Body() body: any, @User() user: Users) {
        try {
            
            return await this.boardService.updateBoard(id,body,user,C_BoardCategory.PHOTO);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Delete('/photo/:id')
    @UseGuards(LoggedInGuard)
    async deletePhoto(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.deleteBoard(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Get('video')
    async getVideo(@Query('page') page: any,@Query('pagesize') pageSize: any, @Query('hot') hot: any = false) {
        return await this.boardService.getBoard(C_BoardCategory.VIDEO,page,pageSize,hot);
    }

    @Get('video/:id')
    async getVideoById(@Param('id') id: any) {
        return await this.boardService.getBoardById(id,C_BoardCategory.VIDEO);
    }

    @Post('video')
    @UseGuards(LoggedInGuard)
    async createVideo(@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.createBoard(body,user,C_BoardCategory.VIDEO);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Patch('video/:id')
    @UseGuards(LoggedInGuard)
    async updateVideo(@Param('id') id: any,@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.updateBoard(id,body,user,C_BoardCategory.VIDEO);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Delete('video/:id')
    @UseGuards(LoggedInGuard)
    async deleteVideo(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.deleteBoard(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('comment')
    @UseGuards(LoggedInGuard)
    async createComment(@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.createComment(body,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Patch('comment/:id')
    @UseGuards(LoggedInGuard)
    async updateComment(@Param('id') id: any,@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.updateComment(id,body,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Delete('comment/:id')
    @UseGuards(LoggedInGuard)
    async deleteComment(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.deleteComment(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('bookmark/:id')
    @UseGuards(LoggedInGuard)
    async createBookmark(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.createBookmark(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Delete('bookmark/:id')
    @UseGuards(LoggedInGuard)
    async deleteBookmark(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.deleteBookmark(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('like')
    @UseGuards(LoggedInGuard)
    async createLike(@Body() body: any, @User() user: Users) {
        try {
            return await this.boardService.likeBoard(body.id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Delete('like/:id')
    @UseGuards(LoggedInGuard)
    async deleteLike(@Param('id') id: any, @User() user: Users) {
        try {
            return await this.boardService.unlikeBoard(id,user);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }


    


    
}

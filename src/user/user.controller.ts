import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { LoggedInGuard } from '../common/guards/logged-in.guard';
import { Users } from '../entities/user.entity';
import { UserService } from './user.service';

@Controller('v1/api/user')
export class UserController { 
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get()
    @UseGuards(LoggedInGuard)
    async getUser(@User() user: Users,@Query('pagesize') pageSize: any) {
        return await this.userService.getUser(user,pageSize);
    }

    @Get('/board')
    @UseGuards(LoggedInGuard)
    async getUserBoard(@Query('page') page: any,@Query('pagesize') pageSize: any, @User() user: Users) {
        return await this.userService.getMyBoards(user,page,pageSize);
    }

    @Get('/comment')
    @UseGuards(LoggedInGuard)
    async getUserComment(@Query('page') page: any,@Query('pagesize') pageSize: any, @User() user: Users) {
        return await this.userService.getMyComments(user,page,pageSize);
    }

    @Get('/bookmark')
    @UseGuards(LoggedInGuard)
    async getUserBookmark(@Query('page') page: any,@Query('pagesize') pageSize: any, @User() user: Users) {
        return await this.userService.getMyBookmarks(user,page,pageSize);
    }

    @Post('/nickname')
    @UseGuards(LoggedInGuard)
    async changeNickname(@User() user: Users, @Body() body: any) {
        return await this.userService.changeNickname(user,body.nickname);
    }

    @Post('/profile')
    @UseGuards(LoggedInGuard)
    async changeProfile(@User() user: Users, @Body() body: any) {
        return await this.userService.changeProfile(user,body.profile);
    }

}

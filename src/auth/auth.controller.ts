import { Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverAuthGuard } from './naver.guard';
import { KakaoAuthGuard } from './kakao.guard';
import { User } from '..//common/decorators/user.decorator';
import { Users } from '..//entities/user.entity';
import { LoggedInGuard } from '..//common/guards/logged-in.guard';
import { SuperAuthGuard } from './super.guard';
@Controller('v1/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/kakao')
    @UseGuards(KakaoAuthGuard)
    async kakaoAuth(@User() user : Users) {
        return user;
    }

    @Post('/naver')
    @UseGuards(NaverAuthGuard)
    async naverAuth(@User() user :Users) {
        return user;
    }

    @Post('/super')
    @UseGuards(SuperAuthGuard)
    async superAuth(@Req() req : any) {}


    @Post('/logout')
    @UseGuards(LoggedInGuard)
    async logout(@Req() req : any,@Res() res:any) {
      req.logout((err) => {
        if (err) {
            return res.send({error: err});
        }
        res.clearCookie('connect.sid');
        return res.send({message:'logout'});
      });
    }
}


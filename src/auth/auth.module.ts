import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './kakao.strategy';
import { NaverStrategy } from './naver.strategy';
import { SessionSerializer } from './session.serializer';
import { SuperStrategy } from './super.strategy';
import { TestStrategy } from './test.strategy';

@Module({
  imports: [
    PassportModule.register({session:true}),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AuthController],
  providers: [ AuthService,KakaoStrategy,NaverStrategy,SuperStrategy,SessionSerializer],
})
export class AuthModule {}

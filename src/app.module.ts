import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Boards } from './entities/board.entity';
import { BoardTagMap } from './entities/board_tag_map.entity';
import { Comments } from './entities/comment.entity';
import { Likes } from './entities/like.entity';
import { Tags } from './entities/tag.entity';
import { Users } from './entities/user.entity';

@Module({
  imports: [
    UserModule,
    BoardModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // 데이터베이스 타입
      host: process.env.MYSQL_HOSTNAME, // 호스트 주소
      port: Number(process.env.MYSQL_PORT), // 포트 번호
      username: 'root', // 사용자 이름
      password: process.env.MYSQL_PASSWORD, // 사용자 비밀번호
      database: process.env.MYSQL_DATABASE, // 데이터베이스 이름
      entities: [Users, BoardTagMap, Boards, Comments, Likes, Tags], // 엔티티
      autoLoadEntities: true, // 엔티티 자동 로드 여부
      synchronize: true, // 스키마 자동 생성 여부
    }),
  ],
  controllers: [
      AppController],
  providers: [AppService],
})
export class AppModule { }

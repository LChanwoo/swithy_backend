import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import RedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true, 
    credentials: true,
    preflightContinue: false,
  });
  app.use(
    session({
    store: new RedisStore({
      client: new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      }),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge : 1000 * 60 * 60 * 24 * 7,
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3400);
}
bootstrap();
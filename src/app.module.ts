import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './configs/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { STATIC } from './constants/global.constant';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', `${STATIC}`),
      serveRoot: `/${STATIC}/`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes('*')
      .apply(LoggerMiddleware) // Apply LoggerMiddleware globally
      .forRoutes('*')
      .apply(JwtMiddleware) // Apply JwtMiddleware to routes containing "secured"
      .forRoutes('*secured*')
      .apply(StaticFileCheckMiddleware)
      .forRoutes('/static/*'); // Apply to all static file routes;
  }
}

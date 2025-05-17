import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: true,
};
export function configwebSettings(app: INestApplication) {
  app.enableCors(corsConfig);
  //   app.setGlobalPrefix('api');
  //   app.enableShutdownHooks();
}

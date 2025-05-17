import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  createDatabaseIfNotExists,
  setInitialSequenceValues,
} from './configs/database.config';
import { configwebSettings } from './configs/web.config';
import { CustomLoggerService } from './logging/logger.service';
import { faviconMiddleware } from './middleware/favicon.middleware';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactoryPipe } from './pipes/nested-object.validation.pipe';

async function bootstrap() {
  // Create the database if it doesn't exist
  await createDatabaseIfNotExists();

  const app = await NestFactory.create(AppModule);

  // call the web config function
  configwebSettings(app);

  const customLogger = app.get(CustomLoggerService);
  app.useLogger(customLogger);
  app.use(faviconMiddleware);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: validationExceptionFactoryPipe,
    }),
  );

  customLogger.log('Nest application is starting...');

  process.on('unhandledRejection', (reasone: any) => {
    customLogger.error(reasone);
  });

  process.on('uncaughtException', (reasone: any) => {
    customLogger.error(reasone);
  });

  // entity id sequence start values
  await setInitialSequenceValues();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

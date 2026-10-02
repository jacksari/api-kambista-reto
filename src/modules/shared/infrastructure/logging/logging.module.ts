import { Global, Module } from '@nestjs/common';
import { NestAppLogger } from './nest-app-logger.service';

@Global()
@Module({
  providers: [NestAppLogger],
  exports: [NestAppLogger],
})
export class LoggingModule {}

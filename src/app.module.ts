import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsService } from './api/authors/authors.service';
import { HttpModule } from '@nestjs/axios';
import { AuthorsController } from './api/authors/authors.controller';
import { KnexModule } from 'nest-knexjs';
import KnexConfig from 'knexfile';

@Module({
  imports: [
    KnexModule.forRoot({
      config: KnexConfig,
    }),
    HttpModule,
  ],
  controllers: [AppController, AuthorsController],
  providers: [AppService, AuthorsService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from 'src/config';

import { Seeder } from './seeder';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(configuration().db.connectionString),
    // MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    // MongooseModule.forFeature([
    //   { name: Schedule.name, schema: ScheduleSchema },
    // ]),
  ],
  providers: [Seeder],
  exports: [Seeder],
})
export class SeederModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { EventsModule } from './events/events.module';
import { QueueModule } from './queue/queue.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'staging', 'production')
        .default('development'),

      PORT: Joi.number().default(3000),

      MONGO_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().min(10).required(),

      REDIS_HOST: Joi.string().required(),
      REDIS_PORT: Joi.number().default(6379),
    }),
}),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
    WebhooksModule,
    EventsModule,
    QueueModule,
  ],
})
export class AppModule {}
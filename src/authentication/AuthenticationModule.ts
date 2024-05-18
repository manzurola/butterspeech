import { Module } from '@nestjs/common';
import { AuthenticationController } from './AuthenticationController';

@Module({
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}

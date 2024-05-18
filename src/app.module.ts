import { Module } from '@nestjs/common';
import { SpeechAssessmentModule } from './speech-assessment/speech-assessment.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { AuthenticationModule } from './authentication/AuthenticationModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SpeechAssessmentModule,
    TranscriptionModule,
    AuthenticationModule,
  ],
})
export class AppModule {}

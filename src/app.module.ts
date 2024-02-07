import { Module } from '@nestjs/common';
import { SpeechAssessmentModule } from './speech-assessment/speech-assessment.module';
import { TranscriptionModule } from './transcription/transcription.module';

@Module({
  imports: [SpeechAssessmentModule, TranscriptionModule],
})
export class AppModule {}

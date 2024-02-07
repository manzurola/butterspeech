import { Module } from '@nestjs/common';
import { SpeechAssessmentController } from './speech-assessment.controller';
import { SpeechAssessmentService } from './speech-assessment.service';
import { GoogleTranscriptionService } from '../transcription/transcription.service.google';
import { TranscriptionService } from '../transcription/transcription.service';

@Module({
  controllers: [SpeechAssessmentController],
  providers: [
    SpeechAssessmentService,
    { provide: TranscriptionService, useClass: GoogleTranscriptionService },
  ],
})
export class SpeechAssessmentModule {}

import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { GoogleTranscriptionService } from './transcription.service.google';
import { TranscriptionController } from './transcription.controller';

@Module({
  controllers: [TranscriptionController],
  providers: [
    { provide: TranscriptionService, useClass: GoogleTranscriptionService },
  ],
})
export class TranscriptionModule {}

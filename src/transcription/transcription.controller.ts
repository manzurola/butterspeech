import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { assertLanguageCode } from '../common/language/language';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TranscriptionService } from './transcription.service';
import {
  CreateTranscriptionRequest,
  Transcription,
} from './transcription.controller.types';

@ApiTags('transcription')
@Controller('transcription')
@UseInterceptors(ClassSerializerInterceptor)
export class TranscriptionController {
  private readonly logger = new Logger(TranscriptionController.name);

  constructor(private readonly service: TranscriptionService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Transcription created.',
    type: [Transcription],
  })
  @UseInterceptors(FileInterceptor('audioFile'))
  assessSpeech(
    @Body()
    body: CreateTranscriptionRequest,
    @UploadedFile() audioFile: Express.Multer.File,
  ): Promise<Transcription[]> {
    return this.service.transcribe({
      recording: {
        content: audioFile.buffer.toString('base64'),
        sampleRate: body.sampleRate,
      },
      boostWords: body.boostWords,
      language: assertLanguageCode(body.language),
    });
  }
}

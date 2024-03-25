import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { SpeechAssessmentService } from './speech-assessment.service';
import {
  CreateSpeechAssessmentRequest,
  SpeechAssessment,
} from './speech-assessment.controller.types';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { assertLanguageCode } from '../common/language/language';

@ApiTags('speech/assessment')
@Controller('speech/assessment')
@UseInterceptors(ClassSerializerInterceptor)
export class SpeechAssessmentController {
  constructor(private readonly service: SpeechAssessmentService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Speech assessment successfully created.',
    type: SpeechAssessment,
  })
  @UseInterceptors(FileInterceptor('audioFile'))
  assessSpeech(
    @Body()
    body: CreateSpeechAssessmentRequest,
    @UploadedFile() audioFile: Express.Multer.File,
  ): Promise<SpeechAssessment> {
    return this.service.createSpeechAssessment({
      referenceText: body.referenceText,
      recording: {
        content: audioFile.buffer.toString('base64'),
        sampleRate: body.sampleRate,
      },
      language: assertLanguageCode(body.language),
    });
  }
}

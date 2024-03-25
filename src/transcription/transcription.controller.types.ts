import { LanguageCode } from '../common/language/language';
import { ApiProperty } from '@nestjs/swagger';

export class RecognizedWord {
  @ApiProperty()
  word: string;
}

export class Transcription {
  @ApiProperty()
  transcript: string;
  @ApiProperty({ type: [RecognizedWord] })
  words: RecognizedWord[];
}

export class CreateTranscriptionRequest {
  @ApiProperty()
  boostWords: string[];
  @ApiProperty()
  language: LanguageCode;
  @ApiProperty()
  sampleRate: number;
}

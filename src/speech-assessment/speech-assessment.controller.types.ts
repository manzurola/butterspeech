import { ApiProperty } from '@nestjs/swagger';

export class CreateSpeechAssessmentRequest {
  @ApiProperty()
  referenceText: string;
  @ApiProperty()
  sampleRate: number;
  @ApiProperty()
  language: string;
}

export class ScoredWord {
  @ApiProperty()
  word: string;
  @ApiProperty()
  recognizedWord: string;
  @ApiProperty()
  charOffsetStart: number;
  @ApiProperty()
  charOffsetEnd: number;
  @ApiProperty()
  result: 'Red' | 'Orange' | 'Green' | 'Black';
  @ApiProperty()
  score: number;
}

export class SpeechAssessment {
  @ApiProperty()
  result: 'Success' | 'Fail' | 'Incomprehensible';
  @ApiProperty()
  score: number;
  @ApiProperty({ type: [ScoredWord] })
  scoredWords: ScoredWord[];
}

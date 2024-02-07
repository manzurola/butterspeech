import { ApiProperty } from '@nestjs/swagger';

export class CreateSpeechAssessmentRequest {
  @ApiProperty()
  referenceText: string;
  @ApiProperty()
  sampleRate: number;
  @ApiProperty()
  language: string;
}

export class ReferenceWord {
  @ApiProperty()
  word: string;
  @ApiProperty()
  charStart: number;
  @ApiProperty()
  charEnd: number;
}

export class RecognizedWord {
  @ApiProperty()
  word: string;
}

export class ScoredWord {
  @ApiProperty()
  result: string;
  @ApiProperty()
  score: number;
  @ApiProperty({ type: ReferenceWord })
  reference: ReferenceWord;
  @ApiProperty({ type: RecognizedWord, required: false })
  recognized?: RecognizedWord;
}

export class SpeechAssessment {
  @ApiProperty()
  score: number;
  @ApiProperty({ type: [ScoredWord] })
  words: ScoredWord[];
}

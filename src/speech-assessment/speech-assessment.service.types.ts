import { LanguageCode } from '../language/languages';

export interface ScoredWord {
  result: WordResult;
  score: number;
  reference: ReferenceWord;
  recognized?: RecognizedWord;
}

export interface SpeechAssessment {
  score: number;
  words: ScoredWord[];
}

export type AssessmentResult = '';

export interface AudioContent {
  sampleRate: number;
  content: string;
}

export type WordResult =
  | 'equal'
  | 'missing'
  | 'unnecessary'
  | 'mispronunciation'
  | 'non-word';

export interface ReferenceWord {
  word: string;
  tag: string;
  charStart: number;
  charEnd: number;
}

export interface RecognizedWord {
  word: string;
  confidence: number;
}

export interface Recording {
  // Base64 of the audio content stream
  content: string;
  // Integer representing sample rate in hertz
  sampleRate: number;
}

export class CreateSpeechAssessmentRequest {
  referenceText: string;
  recording: Recording;
  language: LanguageCode;
}

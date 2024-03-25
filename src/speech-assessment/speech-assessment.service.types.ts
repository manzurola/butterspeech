import { LanguageCode } from '../language/languages';

export interface ScoredWord {
  word: string;
  recognizedWord: string;
  charOffsetStart: number;
  charOffsetEnd: number;
  result: ScoredWordResult;
  score: number;
}

export interface SpeechAssessment {
  result: SpeechAssessmentResult;
  score: number;
  scoredWords: ScoredWord[];
}

export type SpeechAssessmentResult = 'Success' | 'Fail';

export interface AudioContent {
  sampleRate: number;
  content: string;
}

export type ScoredWordResult = 'Red' | 'Orange' | 'Green' | 'Black';

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

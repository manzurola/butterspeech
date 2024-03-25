import { LanguageCode } from '../common/language/language';

export type SpeechAssessmentResult = 'Success' | 'Fail';

export type ScoredWordResult = 'Red' | 'Orange' | 'Green' | 'Black';

export type CreateSpeechAssessmentRequest = {
  language: LanguageCode;
  referenceText: string;
  transcription: Transcription;
};

export type Transcription = {
  transcript: string;
  confidence: number;
  words: RecognizedWord[];
};

export type RecognizedWord = {
  word: string;
  confidence: number;
};

export type SpeechAssessment = {
  result: SpeechAssessmentResult;
  score: number;
  scoredWords: ScoredWord[];
};

export type ScoredWord = {
  word: string;
  recognizedWord: string;
  charOffsetStart: number;
  charOffsetEnd: number;
  result: ScoredWordResult;
  score: number;
};

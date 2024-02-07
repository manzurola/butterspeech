import { Recording } from '../speech-assessment/speech-assessment.service.types';
import { LanguageCode } from '../language/languages';

export interface TranscriptionRequest {
  recording: Recording;
  boostWords: string[];
  language: LanguageCode;
}

export interface Transcription {
  transcript: string;
  confidence: number;
  words: RecognizedWord[];
}

export interface RecognizedWord {
  word: string;
  confidence: number;
}

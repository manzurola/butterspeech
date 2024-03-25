import { Transcription, TranscriptionRequest } from '../transcription.types';

export interface TranscriptionAdapter {
  transcribe({
    recording,
    boostWords,
    language,
  }: TranscriptionRequest): Promise<Transcription[]>;
}

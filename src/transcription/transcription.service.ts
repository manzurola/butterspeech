import { Transcription, TranscriptionRequest } from './transcription.types';

export abstract class TranscriptionService {
  transcribe: (request: TranscriptionRequest) => Promise<Transcription[]>;
}

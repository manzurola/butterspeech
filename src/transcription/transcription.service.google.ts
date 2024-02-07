import { v1p1beta1 as speech } from '@google-cloud/speech';
import { Transcription, TranscriptionRequest } from './transcription.types';
import { TranscriptionService } from './transcription.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleTranscriptionService implements TranscriptionService {
  private readonly client = new speech.SpeechClient();

  public async transcribe({
    recording,
    boostWords,
    language,
  }: TranscriptionRequest): Promise<Transcription[]> {
    const request = {
      config: {
        encoding: 'LINEAR16' as const,
        sampleRateHertz: recording.sampleRate,
        audioChannelCount: 1,
        languageCode: language,
        enableWordConfidence: true,
        boostWords,
      },
      audio: {
        content: recording.content,
      },
    };

    const [response] = await this.client.recognize(request);
    return (
      response?.results[0]?.alternatives?.map((alternative): Transcription => {
        return {
          transcript: alternative.transcript,
          confidence: alternative.confidence,
          words: alternative.words.map((word) => ({
            word: word.word,
            confidence: word.confidence,
          })),
        };
      }) || []
    );
  }
}

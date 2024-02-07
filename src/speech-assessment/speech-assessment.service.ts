import { Injectable, Logger } from '@nestjs/common';
import * as WinkTokenizer from 'wink-tokenizer';
import { Token } from 'wink-tokenizer';
import { createAligner } from 'align-arr';
import { TranscriptionService } from '../transcription/transcription.service';
import {
  CreateSpeechAssessmentRequest,
  ReferenceWord,
  ScoredWord,
  SpeechAssessment,
  WordResult,
} from './speech-assessment.service.types';

@Injectable()
export class SpeechAssessmentService {
  private readonly logger = new Logger(SpeechAssessmentService.name);
  private readonly tokenizer = new WinkTokenizer();
  private readonly aligner = createAligner({
    equals: (s, t) => s.word.toLowerCase() === t.word.toLowerCase(),
  });

  constructor(private readonly transcriber: TranscriptionService) {}

  public async assessSpeech(
    request: CreateSpeechAssessmentRequest,
  ): Promise<SpeechAssessment> {
    this.logger.log('assessSpeech started');
    const referenceTokens = this.tokenize(request.referenceText).filter(
      (t) => t.tag === 'word',
    );
    const boostWords = referenceTokens.map((t) => t.word);
    const transcriptions = await this.transcriber.transcribe({
      recording: request.recording,
      boostWords,
      language: request.language,
    });
    const recognizedWords = transcriptions[0]?.words || [];
    this.logger.log({ recognizedWords });
    const alignment = this.aligner.align(recognizedWords, referenceTokens);
    const words: ScoredWord[] = alignment
      .filter((e) => e.operation !== 'delete')
      .map((e) => {
        const source = e.source.data;
        const target = e.target.data;
        const pronunciation = capNum(source?.confidence || 0.0);
        let result: WordResult = 'equal';
        if (e.target.data?.tag !== 'word') {
          result = 'non-word';
        } else if (e.operation === 'equal' && pronunciation < 0.85) {
          result = 'mispronunciation';
        } else if (e.operation === 'substitute') {
          result = 'mispronunciation';
        } else if (e.operation === 'insert') {
          result = 'missing';
        }
        return {
          score: capNum(source?.confidence || 0.0),
          recognized: !!source ? { ...source } : undefined,
          reference: !!target ? { ...target } : undefined,
          result,
        };
      });
    const score = capNum(
      words
        .filter(({ result }) => result !== 'non-word')
        .filter(({ result }) => result !== 'unnecessary')
        .map(({ score }) => score)
        .reduce((a, b) => a + b, 0) / words.length,
    );

    this.logger.log('Speech assessment complete', {
      score,
      words,
    });

    return {
      score,
      words,
    };
  }

  private tokenize(text: string): ReferenceWord[] {
    const tokens = this.tokenizer.tokenize(text);
    const bounds = getBounds(text, tokens);
    return tokens.map((t, i) => ({
      word: t.value,
      tag: t.tag,
      charStart: bounds[i].charStart,
      charEnd: bounds[i].charEnd,
    }));
  }
}

const capNum = (num: number): number => {
  return Math.floor(num * 100) / 100;
};

const getBounds = (
  referenceText: string,
  referenceWords: Token[],
): { charStart: number; charEnd: number }[] => {
  // for each word, get position in text
  const bounds = [];
  let charStart = 0;
  for (const word of referenceWords) {
    charStart = referenceText.indexOf(word.value, charStart);
    if (charStart < 0) {
      break; // fail all
    }
    const charEnd = charStart + word.value.length;
    bounds.push({ charStart, charEnd });
    charStart = charEnd;
  }
  return bounds;
};

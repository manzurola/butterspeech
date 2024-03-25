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
  ScoredWordResult,
  SpeechAssessmentResult,
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
      .filter((e) => e.operation !== 'insert')
      .map((e) => {
        const recognizedWord = e.source.data;
        const referenceWord = e.target.data;
        const score = capNum(recognizedWord?.confidence || 0.0);
        let result: ScoredWordResult = 'Green';
        if (e.target.data?.tag !== 'word') {
          result = 'Black';
        } else if (e.operation === 'equal' && score < 0.85) {
          result = 'Orange';
        } else if (e.operation === 'substitute') {
          result = 'Red';
        }

        return {
          score: capNum(recognizedWord?.confidence || 0.0),
          result,
          word: referenceWord.word,
          charOffsetStart: referenceWord.charStart,
          charOffsetEnd: referenceWord.charEnd,
          recognizedWord: recognizedWord.word,
        };
      });
    const totalScore = capNum(
      words.map(({ score }) => score).reduce((a, b) => a + b, 0) / words.length,
    );

    this.logger.log('Speech assessment complete', {
      score: totalScore,
      words,
    });

    const finalResult: SpeechAssessmentResult =
      totalScore > 0.6 ? 'Success' : 'Fail';

    return {
      result: finalResult,
      score: totalScore,
      scoredWords: words,
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

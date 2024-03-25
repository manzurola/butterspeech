import { Injectable, Logger } from '@nestjs/common';
import { createAligner } from 'align-arr';
import {
  CreateSpeechAssessmentRequest,
  ScoredWord,
  ScoredWordResult,
  SpeechAssessment,
  SpeechAssessmentResult,
} from './speech-assessment.service.types.new';
import { Tokenizer } from '../common/tokenizer/tokenizer';
import { capNum } from '../common/utils/number-utils';
import { assertLanguageCode } from '../common/language/language';

@Injectable()
export class SpeechAssessmentService {
  private readonly logger = new Logger(SpeechAssessmentService.name);
  private readonly tokenizer = new Tokenizer();
  private readonly aligner = createAligner({
    equals: (s, t) => s.word.toLowerCase() === t.word.toLowerCase(),
  });

  public async assessSpeech({
    language,
    referenceText,
    transcription,
  }: CreateSpeechAssessmentRequest): Promise<SpeechAssessment> {
    this.logger.log('assessSpeech started');

    assertLanguageCode(language);

    const recognizedWords = transcription.words;
    const referenceWords = this.tokenizer
      .tokenize(referenceText)
      .filter((t) => t.tag === 'word');

    const alignment = this.aligner.align(recognizedWords, referenceWords);

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
}

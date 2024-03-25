import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as path from 'path';
import { mock, mockReset } from 'jest-mock-extended';
import { TranscriptionService } from '../src/transcription/transcription.service';

describe('SpeechAssessmentController (e2e)', () => {
  let app: INestApplication;

  const transcriptionServiceMock = mock<TranscriptionService>();
  const testAudioFilePath = path.join(
    process.cwd(),
    './test/assets/speech-sample-i-love-dancing.wav',
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TranscriptionService)
      .useValue(transcriptionServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    mockReset(transcriptionServiceMock);
  });

  describe('/speech/assessment (POST)', () => {
    it('successfully creates a SpeechAssessment given reference text and a transcription', () => {
      transcriptionServiceMock.transcribe.mockResolvedValue(
        Promise.resolve([
          {
            transcript: 'I love dancing so much',
            confidence: 0.9801715612411499,
            words: [
              { word: 'I', confidence: 0.9961875677108765 },
              { word: 'love', confidence: 0.9765672087669373 },
              { word: 'dancing', confidence: 0.9991816282272339 },
              { word: 'so', confidence: 0.9886923432350159 },
              { word: 'much', confidence: 0.9402294158935547 },
            ],
          },
        ]),
      );

      return request(app.getHttpServer())
        .post('/speech/assessment')
        .field('referenceText', 'I love dancing so much.')
        .field('language', 'en')
        .field('sampleRate', 16000)
        .attach('audioFile', testAudioFilePath)
        .expect(201)
        .expect({
          result: 'Success',
          score: 0.97,
          scoredWords: [
            {
              score: 0.99,
              result: 'Green',
              word: 'I',
              charOffsetStart: 0,
              charOffsetEnd: 1,
              recognizedWord: 'I',
            },
            {
              score: 0.97,
              result: 'Green',
              word: 'love',
              charOffsetStart: 2,
              charOffsetEnd: 6,
              recognizedWord: 'love',
            },
            {
              score: 0.99,
              result: 'Green',
              word: 'dancing',
              charOffsetStart: 7,
              charOffsetEnd: 14,
              recognizedWord: 'dancing',
            },
            {
              score: 0.98,
              result: 'Green',
              word: 'so',
              charOffsetStart: 15,
              charOffsetEnd: 17,
              recognizedWord: 'so',
            },
            {
              score: 0.94,
              result: 'Green',
              word: 'much',
              charOffsetStart: 18,
              charOffsetEnd: 22,
              recognizedWord: 'much',
            },
          ],
        });
    });
  });
});

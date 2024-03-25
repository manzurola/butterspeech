import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as path from 'path';

describe('TranscriptionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/transcription (POST)', () => {
    it('transcribes an English audio file', () => {
      const audioFilePath = path.join(
        process.cwd(),
        './test/assets/speech-sample-i-love-dancing.wav',
      );

      console.log(audioFilePath);

      return request(app.getHttpServer())
        .post('/transcription')
        .field('boostWords', [])
        .field('language', 'en')
        .field('sampleRate', 16000)
        .attach('audioFile', audioFilePath)
        .expect(201)
        .expect([
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
        ]);
    });
  });
});

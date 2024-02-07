import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('SpeechAssessmentController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const config = new DocumentBuilder()
      .setTitle('ShutApp API')
      .setDescription('The ShutApp API')
      .setVersion('1.0')
      .addTag('shutapp')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  });

  xit('/speech/assessment (POST)', async () => {
    const expected = {
      score: 0.97,
      words: [
        {
          result: 'equal',
          score: 0.98,
          recognized: { word: 'I' },
          reference: { word: 'I' },
        },
        {
          result: 'equal',
          score: 0.96,
          recognized: { word: 'love' },
          reference: { word: 'love' },
        },
        {
          result: 'equal',
          score: 0.98,
          recognized: { word: 'dancing' },
          reference: { word: 'dancing' },
        },
        {
          result: 'equal',
          score: 0.98,
          recognized: { word: 'so' },
          reference: { word: 'so' },
        },
        {
          result: 'equal',
          score: 0.98,
          recognized: { word: 'much' },
          reference: { word: 'much' },
        },
        {
          result: 'non-word',
          score: 0,
          reference: { word: '.' },
        },
      ],
    };
    const test = await request(app.getHttpServer())
      .post('/speech/assessment')
      .attach('audioFile', './speech-sample-i-love-dancing.wav')
      .field('referenceText', 'I love dancing so much.')
      .field('sampleRate', 16000)
      .field('language', 'en')
      .expect(201);

    console.log(JSON.stringify(test.body));
    // return test
    //   .expect(expected);
  });

  afterAll(async () => {
    await app.close();
  });
});

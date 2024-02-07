import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TranscriptionModule } from './transcription.module';

describe('TranscriptionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TranscriptionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/transcription (POST)', () => {
    it('transcribes a sentence in English', async () => {
      await request(app.getHttpServer())
        .post('/transcription')
        .send({ text: 'I love dancing so much.', targetLanguage: 'ru' })
        .expect(201)
        .expect({ results: ['Я так люблю танцевать.'] });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

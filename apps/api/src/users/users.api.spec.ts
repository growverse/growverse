import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_URL = mongo.getUri();
    process.env.REDIS_URL = 'redis://localhost:6379';

    const { AppModule } = await import('../app.module.js');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });

  it('CRUD flow', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'a@a.com', username: 'u1', role: 'learner', subRole: 'basic' })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer()).get(`/users/${id}`).expect(200);

    await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({ role: 'admin', subRole: 'global', preferences: { audioVolume: 40 } })
      .expect(200);

    const prefRes = await request(app.getHttpServer()).get(`/users/${id}/preferences`).expect(200);
    expect(prefRes.body.audioVolume).toBe(40);

    await request(app.getHttpServer()).delete(`/users/${id}`).expect(200);
  });
});

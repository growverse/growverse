import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../core/config/validation.js';
import { AuthModule } from './auth.module.js';
import { UserRepository } from '../users/infrastructure/mongo/user.repository.js';
import { User } from '../users/domain/entities/user.entity.js';
import { randomUUID } from 'crypto';
import { RedisModule } from '../core/redis/redis.module.js';

describe('Auth Me API', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let mongo: MongoMemoryServer;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_URL = mongo.getUri();
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'test';
    process.env.VITEST = 'true';

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, validationSchema }),
        MongooseModule.forRoot(mongo.getUri()),
        RedisModule,
        AuthModule,
      ],
    }).compile();

    const repo = moduleRef.get(UserRepository);
    const user = User.create(randomUUID(), {
      email: 'a@a.com',
      username: 'u1',
      role: 'learner',
      subRole: 'basic',
    });
    await repo.create(user);
    userId = user.snapshot.id;

    app = moduleRef.createNestApplication();
    await app.init();

    const genRes = await request(app.getHttpServer())
      .post('/auth/generate-token')
      .send({ userId })
      .expect(201);
    accessToken = genRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
    await mongo.stop();
  });

  it('returns current user profile', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/me')
      .send({ token: accessToken })
      .expect(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.email).toBe('a@a.com');
  });

  it('rejects invalid token', async () => {
    await request(app.getHttpServer())
      .post('/auth/me')
      .send({ token: 'bad' })
      .expect(401);
  });
});

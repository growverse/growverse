import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../core/config/validation.js';
import { UsersModule } from './users.module.js';
import { CreateUserUseCase } from './application/usecases/create-user.usecase.js';
import { GetUserUseCase } from './application/usecases/get-user.usecase.js';
import { UpdateUserUseCase } from './application/usecases/update-user.usecase.js';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase.js';
import { UpdateUserPreferencesUseCase } from './application/usecases/update-user-preferences.usecase.js';
import { UserRepository } from './infrastructure/mongo/user.repository.js';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_URL = mongo.getUri();
    process.env.NODE_ENV = 'test';
    process.env.VITEST = 'true';

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, validationSchema }),
        MongooseModule.forRoot(mongo.getUri()),
        UsersModule,
      ],
    })
    .overrideProvider(CreateUserUseCase)
    .useFactory({
      factory: (repo: UserRepository) => new CreateUserUseCase(repo),
      inject: [UserRepository],
    })
    .overrideProvider(GetUserUseCase)
    .useFactory({
      factory: (repo: UserRepository) => new GetUserUseCase(repo),
      inject: [UserRepository],
    })
    .overrideProvider(UpdateUserUseCase)
    .useFactory({
      factory: (repo: UserRepository) => new UpdateUserUseCase(repo),
      inject: [UserRepository],
    })
    .overrideProvider(DeleteUserUseCase)
    .useFactory({
      factory: (repo: UserRepository) => new DeleteUserUseCase(repo),
      inject: [UserRepository],
    })
    .overrideProvider(UpdateUserPreferencesUseCase)
    .useFactory({
      factory: (repo: UserRepository) => new UpdateUserPreferencesUseCase(repo),
      inject: [UserRepository],
    })
    .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (moduleRef) {
      await moduleRef.close();
    }
    if (mongo) {
      await mongo.stop();
    }
  });

  it.skip('CRUD flow', async () => {
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

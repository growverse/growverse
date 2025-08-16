import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, Model } from 'mongoose';
import { UserSchema, UserDocument } from './user.model.js';
import { UserRepository } from './user.repository.js';
import { User } from '../../domain/entities/user.entity.js';

describe('UserRepository (integration)', () => {
  let mongo: MongoMemoryServer;
  let repo: UserRepository;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await connect(mongo.getUri());
    const model: Model<UserDocument> = connection.model('User', UserSchema);
    repo = new UserRepository(model);
  });

  afterAll(async () => {
    await connection.close();
    await mongo.stop();
  });

  it('performs CRUD roundtrip', async () => {
    const user = User.create('u1', {
      email: 'a@a.com',
      username: 'u1',
      passwordHash: 'hash',
      role: 'learner',
      subRole: 'basic',
    });
    const created = await repo.create(user);
    expect(created.snapshot.email).toBe('a@a.com');

    const found = await repo.findById(created.snapshot.id);
    expect(found?.snapshot.username).toBe('u1');
    const byUsername = await repo.findByUsername('u1');
    expect(byUsername?.snapshot.email).toBe('a@a.com');

    created.changeRole('admin', 'global');
    const updated = await repo.update(created);
    expect(updated.snapshot.role).toBe('admin');

    await repo.delete(updated.snapshot.id);
    const removed = await repo.findById(updated.snapshot.id);
    expect(removed).toBeNull();
  });
});

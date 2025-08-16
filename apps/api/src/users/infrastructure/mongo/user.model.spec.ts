import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, Model } from 'mongoose';
import { UserSchema, UserDocument } from './user.model.js';

describe('UserModel (integration)', () => {
  let mongo: MongoMemoryServer;
  let model: Model<UserDocument>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await connect(mongo.getUri());
    model = connection.model<UserDocument>('UserModel', UserSchema);
  });

  afterAll(async () => {
    await connection.close();
    await mongo.stop();
  });

  it('applies default preferences and persists updates', async () => {
    await model.create({
      _id: 'u1',
      email: 'a@a.com',
      username: 'u1',
      passwordHash: 'hash',
      role: 'learner',
      subRole: 'basic',
    });
    const doc = await model.findById('u1').lean().exec();
    expect(doc?.preferences.notifications).toBe(true);
    expect(doc?.preferences.theme).toBe('light');
    await model.updateOne({ _id: 'u1' }, { $set: { 'preferences.notifications': false, 'preferences.theme': 'dark' } });
    const updated = await model.findById('u1').lean().exec();
    expect(updated?.preferences.notifications).toBe(false);
    expect(updated?.preferences.theme).toBe('dark');
  });
});

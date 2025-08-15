import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { User } from '../../domain/entities/user.entity.js';
import { UserDocument } from './user.model.js';
import * as mapper from '../../mappers/user.mapper.js';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel('User') private readonly model: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const doc = await this.model.create(mapper.toPersistence(user));
    return mapper.toDomain(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? mapper.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ email }).exec();
    return doc ? mapper.toDomain(doc) : null;
  }

  async update(user: User): Promise<User> {
    const persistence = mapper.toPersistence(user);
    const doc = await this.model.findByIdAndUpdate(user.snapshot.id, persistence, { new: true }).exec();
    return mapper.toDomain(doc!);
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}

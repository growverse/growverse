import { Schema, Document } from 'mongoose';
import { ROLE_CATALOG } from '../../domain/value-objects/role/role.catalog.js';
import { UserPreferences } from '../../domain/value-objects/preferences/preferences.types.js';

export interface UserDocument extends Document {
  _id: string;
  email: string;
  username: string;
  passwordHash: string;
  displayName?: string;
  avatarUrl?: string;
  role: string;
  subRole: string;
  status: string;
  preferences: UserPreferences;
}

const PreferencesSchema = new Schema<UserPreferences>({
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },
  graphics: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  audioVolume: { type: Number, default: 70 },
  micEnabled: { type: Boolean, default: false },
  chatEnabled: { type: Boolean, default: true },
  notifications: { type: Boolean, default: true },
  theme: { type: String, enum: ['dark', 'light'], default: 'light' },
}, { _id: false });

export const UserSchema = new Schema<UserDocument>({
  _id: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String },
  avatarUrl: { type: String },
  role: { type: String, enum: Object.keys(ROLE_CATALOG), required: true },
  subRole: {
    type: String,
    required: true,
    validate: {
      validator(value: string) {
        const role = (this as any).role as keyof typeof ROLE_CATALOG;
        return (ROLE_CATALOG[role]?.subRoles as readonly string[]).includes(value);
      },
      message: 'Invalid subRole for role',
    },
  },
  status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
  preferences: { type: PreferencesSchema, default: {} },
}, { timestamps: true });

UserSchema.index({ role: 1, subRole: 1 });

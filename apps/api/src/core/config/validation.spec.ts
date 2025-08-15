import { validationSchema } from './validation.js';

describe('ValidationSchema', () => {
  it('should validate correct environment variables', () => {
    const env = {
      PORT: '8000',
      CORS_ORIGIN: 'http://localhost:5173',
      MONGO_URL: 'mongodb://localhost:27017/test',
      REDIS_URL: 'redis://localhost:6379',
      NODE_ENV: 'development',
    };

    const { error } = validationSchema.validate(env);
    expect(error).toBeUndefined();
  });

  it('should use default values for optional fields', () => {
    const env = {
      MONGO_URL: 'mongodb://localhost:27017/test',
      REDIS_URL: 'redis://localhost:6379',
    };

    const { error, value } = validationSchema.validate(env);
    expect(error).toBeUndefined();
    expect(value.PORT).toBe(8000);
    expect(value.CORS_ORIGIN).toBe('http://localhost:5173');
    expect(value.NODE_ENV).toBe('development');
  });

  it('should make REDIS_URL optional in test environment', () => {
    const env = {
      MONGO_URL: 'mongodb://localhost:27017/test',
      NODE_ENV: 'test',
    };

    const { error } = validationSchema.validate(env);
    expect(error).toBeUndefined();
  });

  it('should require REDIS_URL in production environment', () => {
    const env = {
      MONGO_URL: 'mongodb://localhost:27017/test',
      NODE_ENV: 'production',
    };

    const { error } = validationSchema.validate(env);
    expect(error).toBeDefined();
    expect(error?.message).toContain('REDIS_URL');
  });

  it('should validate NODE_ENV values', () => {
    const env = {
      MONGO_URL: 'mongodb://localhost:27017/test',
      REDIS_URL: 'redis://localhost:6379',
      NODE_ENV: 'invalid',
    };

    const { error } = validationSchema.validate(env);
    expect(error).toBeDefined();
    expect(error?.message).toContain('NODE_ENV');
  });
});

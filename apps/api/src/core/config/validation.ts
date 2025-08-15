import Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(8000),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
  MONGO_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().when('NODE_ENV', {
    is: 'test',
    then: Joi.optional(),
    otherwise: Joi.required()
  }),
  JWT_SECRET: Joi.string().default('test-secret'),
  JWT_ISSUER: Joi.string().default('growverse.api'),
  JWT_AUDIENCE: Joi.string().default('growverse.web'),
  ACCESS_TOKEN_TTL: Joi.string().default('15m'),
  REFRESH_TOKEN_TTL: Joi.string().default('30d'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  VITEST: Joi.string().optional()
});

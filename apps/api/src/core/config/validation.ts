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
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  VITEST: Joi.string().optional()
});

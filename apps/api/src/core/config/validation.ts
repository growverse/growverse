import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(8000),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
  MONGO_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required()
});

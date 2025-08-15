import { describe, it, expect } from 'vitest';
import { ApiError } from '../errors';

describe('ApiError', () => {
  it('keeps message, status, data', () => {
    const e = new ApiError<{ x: number }>('boom', 400, { x: 1 });
    expect(e.message).toBe('boom');
    expect(e.status).toBe(400);
    expect(e.data?.x).toBe(1);
  });
});

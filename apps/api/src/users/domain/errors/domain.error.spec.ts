import { DomainError } from './domain.error.js';

describe('DomainError', () => {
  it('should create a domain error with message', () => {
    const error = new DomainError('Test error message');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe('Test error message');
    expect(error.name).toBe('DomainError');
  });

  it('should extend Error class properly', () => {
    const error = new DomainError('Custom error');

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Custom error');
    expect(error.name).toBe('DomainError');
  });

  it('should have default name as DomainError', () => {
    const error = new DomainError('Test message');

    expect(error.name).toBe('DomainError');
  });
});

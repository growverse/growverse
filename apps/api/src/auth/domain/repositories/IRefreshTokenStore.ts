export interface IRefreshTokenStore {
  save(userId: string, jti: string, ttlSec: number): Promise<void>;
  exists(userId: string, jti: string): Promise<boolean>;
  delete(userId: string, jti: string): Promise<void>;
  deleteAllForUser?(userId: string): Promise<void>;
}

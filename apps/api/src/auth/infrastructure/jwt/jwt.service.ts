import { Injectable } from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';
import { randomUUID } from 'crypto';
import { JwtClaims } from '../../domain/value-objects/token.types.js';

function parseTtl(ttl: string): number {
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid ttl format: ${ttl}`);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const map: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * map[unit];
}

@Injectable()
export class JwtService {
  private readonly secret = new TextEncoder().encode(process.env.JWT_SECRET || 'test-secret');
  private readonly issuer = process.env.JWT_ISSUER || 'growverse.api';
  private readonly audience = process.env.JWT_AUDIENCE || 'growverse.web';
  private readonly accessTtl = process.env.ACCESS_TOKEN_TTL || '15m';
  private readonly refreshTtl = process.env.REFRESH_TOKEN_TTL || '30d';

  get refreshTtlSeconds(): number {
    return parseTtl(this.refreshTtl);
  }

  async signAccess(claims: JwtClaims, ttl = this.accessTtl): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + parseTtl(ttl);
    const jti = randomUUID();
    return new SignJWT({ ...claims })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt(now)
      .setExpirationTime(exp)
      .setJti(jti)
      .sign(this.secret);
  }

  async signRefresh({ sub }: Pick<JwtClaims, 'sub'>, ttl = this.refreshTtl): Promise<{ token: string; jti: string }> {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + parseTtl(ttl);
    const jti = randomUUID();
    const token = await new SignJWT({ sub })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt(now)
      .setExpirationTime(exp)
      .setJti(jti)
      .sign(this.secret);
    return { token, jti };
  }

  async verify(token: string): Promise<JwtClaims> {
    const { payload } = await jwtVerify(token, this.secret, {
      issuer: this.issuer,
      audience: this.audience,
    });
    return payload as JwtClaims;
  }
}

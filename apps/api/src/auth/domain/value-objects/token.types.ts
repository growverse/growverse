export type JwtClaims = {
  sub: string;
  role: 'admin' | 'instructor' | 'learner';
  subRole: string;
  username?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  jti?: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export interface UserModel {
  DeviceId: string;
  Email: string;
  Fullname: string;
  InstallId: string;
  RefreshToken: string;
  Status: string;
  Token: string;
  TokenType?: string;
  Expiry?: string;
}

export interface RefreshTokenModel {
  Expired: string;
  InvalidUntil: string;
  UserId: number;
}

export interface TokenModel {
  ClientId: number;
  Email: string;
  Expired: string;
  Fullname: string;
  Permission: string[];
  Phone: string;
  PlatformScope: string;
  Source: string;
  UserId: number;
  Username: string;
  Image: string;
  jti : string;
  iss : string;
  sub : string;
  sid : string;
}

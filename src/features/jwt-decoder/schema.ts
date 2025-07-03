import { z } from "zod";

// Schema para JWT Header
export const jwtHeaderSchema = z.object({
  alg: z.string().optional(),
  typ: z.string().optional(),
  kid: z.string().optional(),
  x5t: z.string().optional(),
  x5c: z.array(z.string()).optional(),
  x5u: z.string().optional(),
  jku: z.string().optional(),
  jwk: z.record(z.unknown()).optional(),
  x5y: z.string().optional(),
  cty: z.string().optional(),
  crit: z.array(z.string()).optional(),
  enc: z.string().optional(),
  zip: z.string().optional(),
  p2c: z.number().optional(),
  p2s: z.string().optional(),
  epk: z.record(z.unknown()).optional(),
  apu: z.string().optional(),
  apv: z.string().optional(),
  iv: z.string().optional(),
  tag: z.string().optional(),
  uad: z.string().optional(),
}).passthrough();

// Schema para JWT Payload
export const jwtPayloadSchema = z.object({
  iss: z.string().optional(), // Issuer
  sub: z.string().optional(), // Subject
  aud: z.union([z.string(), z.array(z.string())]).optional(), // Audience
  exp: z.number().optional(), // Expiration Time
  nbf: z.number().optional(), // Not Before
  iat: z.number().optional(), // Issued At
  jti: z.string().optional(), // JWT ID
  typ: z.string().optional(), // Type
  cty: z.string().optional(), // Content Type
  alg: z.string().optional(), // Algorithm
  kid: z.string().optional(), // Key ID
  x5t: z.string().optional(), // X.509 Certificate SHA-1 Thumbprint
  x5c: z.array(z.string()).optional(), // X.509 Certificate Chain
  x5u: z.string().optional(), // X.509 Certificate URL
  jku: z.string().optional(), // JWK Set URL
  jwk: z.record(z.unknown()).optional(), // JSON Web Key
  x5y: z.string().optional(), // X.509 Certificate SHA-256 Thumbprint
  crit: z.array(z.string()).optional(), // Critical
  enc: z.string().optional(), // Encryption Algorithm
  zip: z.string().optional(), // Compression Algorithm
  p2c: z.number().optional(), // PBES2 Count
  p2s: z.string().optional(), // PBES2 Salt Input
  epk: z.record(z.unknown()).optional(), // Ephemeral Public Key
  apu: z.string().optional(), // Agreement PartyUInfo
  apv: z.string().optional(), // Agreement PartyVInfo
  iv: z.string().optional(), // Initialization Vector
  tag: z.string().optional(), // Authentication Tag
  uad: z.string().optional(), // Unprotected Header
}).passthrough();

// Schema para JWT completo
export const jwtSchema = z.object({
  header: jwtHeaderSchema,
  payload: jwtPayloadSchema,
  signature: z.string().optional(),
});

export type JwtHeader = z.infer<typeof jwtHeaderSchema>;
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export type Jwt = z.infer<typeof jwtSchema>; 
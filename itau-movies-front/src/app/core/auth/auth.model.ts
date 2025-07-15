export interface Auth {
  message: string;
  token: string;
  expiresIn: string;
  tokenType: string;
}

export interface AuthRequest {
  usuario: string;
  senha: string;
}

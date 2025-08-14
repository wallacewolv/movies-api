import { AuthDTO } from '../dto/auth.dto';

export class Auth {
  private _message: string;
  private _token: string;
  private _expiresIn: string;
  private _tokenType: string;

  constructor({ message, token, expiresIn, tokenType }: AuthDTO) {
    this._message = message;
    this._token = token;
    this._expiresIn = expiresIn;
    this._tokenType = tokenType;
  }

  get message(): string {
    return this._message;
  }

  get token(): string {
    return this._token;
  }

  get expiresIn(): string {
    return this._expiresIn;
  }

  get tokenType(): string {
    return this._tokenType;
  }

  changeMessage(message: string): void {
    this._message = message;
  }

  changeToken(token: string): void {
    this._token = token;
  }

  changeExpiresIn(expiresIn: string): void {
    this._expiresIn = expiresIn;
  }

  changeTokenType(tokenType: string): void {
    this._tokenType = tokenType;
  }

  toJSON(): AuthDTO {
    return {
      message: this._message,
      token: this._token,
      expiresIn: this._expiresIn,
      tokenType: this._tokenType,
    };
  }
}

import { AuthDTO } from '@domain/auth/dto/auth.dto';

export const AUTH_DUMMY = {
  get AUTH_VALUES(): AuthDTO {
    return {
      message: 'Login realizado com sucesso',
      token: 'fake-token',
      expiresIn: '30 minutos',
      tokenType: 'Bearer',
    };
  },
};

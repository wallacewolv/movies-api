import { AuthRequestDTO } from '@domain/auth/dto/auth-request.dto';
import { Auth } from '@domain/auth/entity/auth.entity';
import { Observable } from 'rxjs';

export abstract class AuthGatewayInterface {
  abstract login(credentials: AuthRequestDTO): Observable<Auth>;
}

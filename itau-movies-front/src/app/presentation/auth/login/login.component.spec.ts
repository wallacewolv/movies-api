import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  AlertServiceInterface,
  ErrorAPI,
} from '@core/contracts/alert/service/alert-service.interface';
import { AUTH_DUMMY } from '@core/utils/dummys/auth.dummy';
import { Auth } from '@domain/auth/entity/auth.entity';
import { AuthGatewayInterface } from '@infra/interfaces/auth/auth-gateway.interface';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authGatewaySpy: jasmine.SpyObj<AuthGatewayInterface>;
  let alertServiceSpy: jasmine.SpyObj<AlertServiceInterface>;

  beforeEach(async () => {
    authGatewaySpy = jasmine.createSpyObj<AuthGatewayInterface>(['login']);
    alertServiceSpy = jasmine.createSpyObj<AlertServiceInterface>(['show']);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthGatewayInterface, useValue: authGatewaySpy },
        { provide: AlertServiceInterface, useValue: alertServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and build form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('usuario')).toBeDefined();
    expect(component.loginForm.get('senha')).toBeDefined();
  });

  it('should mark form as invalid if fields are empty or too short', () => {
    const usuarioControl = component.loginForm.get('usuario');
    const senhaControl = component.loginForm.get('senha');

    usuarioControl?.setValue('');
    senhaControl?.setValue('');
    expect(component.loginForm.valid).toBeFalse();

    usuarioControl?.setValue('abc');
    senhaControl?.setValue('1234');
    expect(component.loginForm.valid).toBeFalse();

    usuarioControl?.setValue('abcde');
    senhaControl?.setValue('12345');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should call AuthService.login on form submit with valid data', fakeAsync(() => {
    const loginData = { usuario: 'username', senha: '12345' };
    component.loginForm.setValue(loginData);

    authGatewaySpy.login.and.returnValue(of(new Auth(AUTH_DUMMY.AUTH_VALUES)));

    component.onSubmit();
    tick();

    expect(authGatewaySpy.login).toHaveBeenCalledWith(loginData);
    expect(alertServiceSpy.show).not.toHaveBeenCalled();
  }));

  it('should call AlertService.show on login error', fakeAsync(() => {
    const loginData = { usuario: 'username', senha: '12345' };
    component.loginForm.setValue(loginData);

    const errorResponse: ErrorAPI = {
      error: { error: 'Unauthorized', message: 'Unauthorized' },
    };
    authGatewaySpy.login.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();
    tick();

    expect(authGatewaySpy.login).toHaveBeenCalledWith(loginData);
    expect(alertServiceSpy.show).toHaveBeenCalledWith(errorResponse);
  }));
});

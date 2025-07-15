import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { AlertService, ErrorAPI } from '../../../core/alert/alert.service';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
    ]);
    alertServiceSpy = jasmine.createSpyObj<AlertService>('AlertService', [
      'show',
    ]);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
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

    authServiceSpy.login.and.returnValue(
      of({
        message: 'Login realizado com sucesso',
        token: 'fake-token',
        expiresIn: '30 minutos',
        tokenType: 'Bearer',
      }),
    );

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(loginData);
    expect(alertServiceSpy.show).not.toHaveBeenCalled();
  }));

  it('should call AlertService.show on login error', fakeAsync(() => {
    const loginData = { usuario: 'username', senha: '12345' };
    component.loginForm.setValue(loginData);

    const errorResponse: ErrorAPI = {
      error: { error: 'Unauthorized', message: 'Unauthorized' },
    };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(loginData);
    expect(alertServiceSpy.show).toHaveBeenCalledWith(errorResponse);
  }));
});

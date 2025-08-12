import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  AlertPayload,
  AlertServiceInterface,
} from '@core/contracts/alert/service/alert-service.interface';
import { ALERT_DUMMY } from '@core/utils/dummys/alert.dummy';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let alertServiceSpy: jasmine.SpyObj<AlertServiceInterface>;
  const mockAlertSignal = signal<AlertPayload>(ALERT_DUMMY.ALERT_INITIAL);

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>(['open']);
    alertServiceSpy = jasmine.createSpyObj<AlertServiceInterface>(['clear'], {
      alertMessage: mockAlertSignal,
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AlertServiceInterface, useValue: alertServiceSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show snackbar and clear alert when alertMessage has a payload', () => {
    const payload = { message: 'Erro!', timestamp: Date.now() };
    mockAlertSignal.set(payload);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      payload.message,
      'X',
      jasmine.objectContaining({
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      }),
    );
    expect(alertServiceSpy.clear).toHaveBeenCalled();
  });
});

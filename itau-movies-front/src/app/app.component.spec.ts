import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AlertPayload, AlertService } from './core/alert/alert.service';

describe('AppComponent', () => {
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  const mockAlertSignal = signal<AlertPayload>({
    message: '',
    timestamp: Date.now(),
  });

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    alertServiceSpy = jasmine.createSpyObj<AlertService>(
      'AlertService',
      ['clear'],
      {
        alertMessage: mockAlertSignal,
      },
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AlertService, useValue: alertServiceSpy },
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

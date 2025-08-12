import { Injectable, signal } from '@angular/core';
import {
  AlertPayload,
  AlertServiceInterface,
  ErrorAPI,
} from '@core/contracts/alert/service/alert-service.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService implements AlertServiceInterface {
  private readonly _alertMessage = signal<AlertPayload | null>(null);
  alertMessage = this._alertMessage.asReadonly();

  show(error: ErrorAPI) {
    const message =
      error && error.error && error.error.message
        ? error.error.message
        : 'Erro na chamada';

    this._alertMessage.set({ message, timestamp: Date.now() });
  }

  clear() {
    this._alertMessage.set(null);
  }
}

import { Injectable, signal } from '@angular/core';

type AlertPayload = { message: string; timestamp: number };

export interface ErrorAPI {
  error: {
    error: string;
    message: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
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

import { Signal } from '@angular/core';

export abstract class AlertServiceInterface {
  abstract alertMessage: Signal<AlertPayload | null>;

  abstract show(error: ErrorAPI): void;
  abstract clear(): void;
}

export type AlertPayload = {
  message: string;
  timestamp: number;
};

export interface ErrorAPI {
  error: {
    error: string;
    message: string;
  };
}

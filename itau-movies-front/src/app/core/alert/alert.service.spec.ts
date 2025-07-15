import { TestBed } from '@angular/core/testing';

import { AlertService, ErrorAPI } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService],
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set alertMessage when show is called with error', () => {
    const error: ErrorAPI = {
      error: {
        error: 'BadRequest',
        message: 'Campo obrigatório',
      },
    };

    service.show(error);

    const payload = service.alertMessage();
    expect(payload).toBeTruthy();
    expect(payload?.message).toBe('Campo obrigatório');
    expect(typeof payload?.timestamp).toBe('number');
  });

  it('should set default message if error message is missing', () => {
    const error: ErrorAPI = {
      error: {
        error: 'BadRequest',
        message: '',
      },
    };

    service.show(error);

    const payload = service.alertMessage();
    expect(payload?.message).toBe('Erro na chamada');
  });

  it('should clear alertMessage when clear is called', () => {
    service.show({
      error: { error: 'Error', message: 'Mensagem qualquer' },
    });

    expect(service.alertMessage()).toBeTruthy();

    service.clear();

    expect(service.alertMessage()).toBeNull();
  });
});

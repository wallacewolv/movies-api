import { TestBed } from '@angular/core/testing';
import { ALERT_DUMMY } from '@core/utils/dummys/alert.dummy';

import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  const errorMock = ALERT_DUMMY.ERROR_API;

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
    errorMock.error.message = 'Campo obrigatório';

    service.show(errorMock);

    const payload = service.alertMessage();
    expect(payload).toBeTruthy();
    expect(payload?.message).toBe('Campo obrigatório');
    expect(typeof payload?.timestamp).toBe('number');
  });

  it('should set default message if error message is missing', () => {
    errorMock.error.message = '';

    service.show(errorMock);

    const payload = service.alertMessage();
    expect(payload?.message).toBe('Erro na chamada');
  });

  it('should clear alertMessage when clear is called', () => {
    errorMock.error.message = 'Mensagem qualquer';

    service.show(errorMock);

    expect(service.alertMessage()).toBeTruthy();

    service.clear();

    expect(service.alertMessage()).toBeNull();
  });
});

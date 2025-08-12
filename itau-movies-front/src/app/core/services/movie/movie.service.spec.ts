import { TestBed } from '@angular/core/testing';
import { AlertServiceInterface } from '@core/contracts/alert/service/alert-service.interface';

import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let alertServiceSpy: jasmine.SpyObj<AlertServiceInterface>;

  beforeEach(() => {
    alertServiceSpy = jasmine.createSpyObj<AlertServiceInterface>(['show']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MovieService,
        { provide: AlertServiceInterface, useValue: alertServiceSpy },
      ],
    });

    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

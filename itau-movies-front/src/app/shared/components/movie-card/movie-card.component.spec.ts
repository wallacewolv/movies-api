import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteService } from '../../../core/favorite/favorite.service';
import { MovieCardComponent } from './movie-card.component';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;

  beforeEach(async () => {
    favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', [
      'toggleFavorite',
      'isFavorite',
    ]);

    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      providers: [{ provide: FavoriteService, useValue: favoriteServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call favoriteService.toggleFavorite and emit toggleFavorite when toggle() is called', () => {
    spyOn(component.toggleFavorite, 'emit');

    favoriteServiceSpy.toggleFavorite.and.stub();

    const movieId = 123;
    component.toggle(movieId);

    expect(favoriteServiceSpy.toggleFavorite).toHaveBeenCalledWith(movieId);
    expect(component.toggleFavorite.emit).toHaveBeenCalled();
  });

  it('should call favoriteService.isFavorite and return its value in isFav()', () => {
    const movieId = 456;
    favoriteServiceSpy.isFavorite.and.returnValue(true);

    const result = component.isFav(movieId);

    expect(favoriteServiceSpy.isFavorite).toHaveBeenCalledWith(movieId);
    expect(result).toBe(true);
  });
});

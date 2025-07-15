import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { MovieParamsRequest } from '../../core/movie/movie.model';
import { MovieService } from '../../core/movie/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { FieldPipe } from '../../shared/utils/pipes/field.pipe';
import { getPortuguesePaginatorIntl } from '../../shared/utils/validators/get-portuguese-paginator-intl';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,

    MovieCardComponent,
    FieldPipe,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: getPortuguesePaginatorIntl,
    },
  ],
})
export class MoviesComponent implements OnInit {
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  currentParams: MovieParamsRequest = {
    page: 1,
    limit: 10,
  };

  movies = this.movieService.getMovies();
  pagination = this.movieService.getPagination();
  filters = this.movieService.getFilters();

  sortOrders = computed(() => {
    const { availableSortFields, sortOrders } = this.filters();
    return [...availableSortFields, ...sortOrders];
  });

  availableGenres = this.filters().availableGenres;

  filterGroup!: FormGroup;

  ngOnInit() {
    this.buildForm();
    this.fetchMovies();
    this.fetchFilters();
  }

  buildForm() {
    this.filterGroup = this.formBuilder.group({
      sortField: [''],
      sortOrder: [''],
      name: [''],
      releaseYear: [''],
      genre: [''],
    });
  }

  fetchMovies() {
    this.movieService.fetchMovies(this.currentParams);
  }

  fetchFilters() {
    this.movieService.fetchFilters();
  }

  onSelectionChange(value: any) {
    const sortFields = ['nome', 'anoLancamento', 'genero'];

    if (sortFields.includes(value)) {
      this.updateFilters({ sortBy: value });
    } else {
      this.updateFilters({ order: value });
    }
  }

  toggleChip(genre: string) {
    this.updateFilters({ genero: genre });
  }

  handlePageEvent(event: PageEvent) {
    const changed =
      event.pageIndex !== (this.currentParams.page ?? 1) - 1 ||
      event.pageSize !== this.currentParams.limit;

    if (changed) {
      this.updateFilters({
        page: event.pageIndex + 1,
        limit: event.pageSize,
      });
    }
  }

  updateFilters(update: Partial<MovieParamsRequest>) {
    this.currentParams = { ...this.currentParams, ...update };
    this.fetchMovies();
  }

  goToFavorites() {
    this.router.navigate(['favorites']);
  }

  logout() {
    this.authService.logout();
  }
}

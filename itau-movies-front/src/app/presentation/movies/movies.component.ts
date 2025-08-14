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
import { MovieCardComponent } from '@core/components/movie-card/movie-card.component';
import { AuthServiceInterface } from '@core/contracts/auth/service/auth-service.interface';
import { MovieServiceInterface } from '@core/contracts/movie/service/movie-service.interface';
import { MOVIES_DUMMY } from '@core/utils/dummys/movies.dummy';
import { Route } from '@core/utils/enums/route.enum';
import { FieldPipe } from '@core/utils/pipes/field.pipe';
import { getPortuguesePaginatorIntl } from '@core/utils/validators/get-portuguese-paginator-intl';
import { MovieRequestDTO } from '@domain/movie/dto/movie-request.dto';
import { MovieGatewayInterface } from '@infra/interfaces/movie/movie-gateway.interface';

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
  private movieService = inject(MovieServiceInterface);
  private movieGateway = inject(MovieGatewayInterface);
  private authService = inject(AuthServiceInterface);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  currentParams = MOVIES_DUMMY.CURRENT_PARAMS;

  movies = this.movieService.movies;
  pagination = this.movieService.pagination;
  filters = this.movieService.filters;

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
    this.movieGateway.fetchMovies(this.currentParams);
  }

  fetchFilters() {
    this.movieGateway.fetchFilters();
  }

  onSelectionChange(value: any) {
    const sortFields = MOVIES_DUMMY.SORT_FIELDS;

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

  updateFilters(update: Partial<MovieRequestDTO>) {
    this.currentParams = { ...this.currentParams, ...update };
    this.fetchMovies();
  }

  goToFavorites() {
    this.router.navigate([Route.FAVORITES]);
  }

  logout() {
    this.authService.logout();
  }
}

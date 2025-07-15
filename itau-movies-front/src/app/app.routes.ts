import { Routes } from '@angular/router';

import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/movies/movies.component').then(
        (m) => m.MoviesComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then(
        (m) => m.FavoritesComponent,
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'movies' },
];

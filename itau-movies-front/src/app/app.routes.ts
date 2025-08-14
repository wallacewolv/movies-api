import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { Route } from '@core/utils/enums/route.enum';

export const routes: Routes = [
  { path: Route.HOME, redirectTo: Route.MOVIES, pathMatch: 'full' },
  {
    path: Route.LOGIN,
    loadComponent: () =>
      import('@presentation/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: Route.MOVIES,
    loadComponent: () =>
      import('@presentation/movies/movies.component').then(
        (m) => m.MoviesComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: Route.FAVORITES,
    loadComponent: () =>
      import('@presentation/favorites/favorites.component').then(
        (m) => m.FavoritesComponent,
      ),
    canActivate: [AuthGuard],
  },
  { path: Route.WILD_CARD, redirectTo: Route.MOVIES },
];

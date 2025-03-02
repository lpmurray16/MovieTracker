import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
    canActivate: [() => authGuard()]
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./pages/watchlist/watchlist.component').then(m => m.WatchlistComponent),
    canActivate: [() => authGuard()]
  },
  {
    path: 'in-progress',
    loadComponent: () => import('./pages/in-progress/in-progress.component').then(m => m.InProgressComponent),
    canActivate: [() => authGuard()]
  },
  {
    path: 'watched',
    loadComponent: () => import('./pages/watched/watched.component').then(m => m.WatchedComponent),
    canActivate: [() => authGuard()]
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./pages/movie-details/movie-details.component').then(m => m.MovieDetailsComponent),
    canActivate: [() => authGuard()]
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./pages/watchlist/watchlist.component').then(m => m.WatchlistComponent)
  },
  {
    path: 'in-progress',
    loadComponent: () => import('./pages/in-progress/in-progress.component').then(m => m.InProgressComponent)
  },
  {
    path: 'watched',
    loadComponent: () => import('./pages/watched/watched.component').then(m => m.WatchedComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./pages/movie-details/movie-details.component').then(m => m.MovieDetailsComponent)
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  }
];

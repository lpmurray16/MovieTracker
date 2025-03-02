import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { TrackingService } from '../../services/tracking.service';
import { Movie, MovieStatus } from '../../types/movie.types';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Movies You Want to Watch</h2>

      <div *ngIf="isLoading" class="flex justify-center items-center p-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error mb-4">
        {{ errorMessage }}
      </div>

      <div
        *ngIf="!isLoading && !movies.length"
        class="card bg-base-200 p-8 text-center"
      >
        <p class="mb-4">
          Your watchlist is empty. Start adding movies from the search page!
        </p>
        <a routerLink="/search" class="btn btn-primary">Go to Search</a>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        *ngIf="movies.length"
      >
        <div class="card lg:card-side bg-base-300 shadow-xl" *ngFor="let movie of movies">
          <figure class="lg:w-50 lg:h-full sm:h-50 flex-shrink-0">
            <img
              *ngIf="movie.poster_path"
              [src]="'https://image.tmdb.org/t/p/w300' + movie.poster_path"
              [alt]="movie.title + ' poster'"
              class="w-full h-full object-cover"
            />
            <div
              *ngIf="!movie.poster_path"
              class="w-full h-full flex items-center justify-center bg-base-200 text-base-content/60"
            >
              No poster available
            </div>
          </figure>
          <div class="card-body">
            <h3 class="card-title text-lg">{{ movie.title }}</h3>
            <p class="text-sm opacity-70" *ngIf="movie.release_date">
              {{ movie.release_date | date : 'yyyy' }}
            </p>
            <p class="text-sm" *ngIf="movie.vote_average">
              ⭐ {{ movie.vote_average | number : '1.1-1' }}/10
            </p>
            <p class="text-sm opacity-90 line-clamp-3">{{ movie.overview }}</p>
            <div class="card-actions flex-col gap-4 mt-4 items-center">
              <a
                [routerLink]="['/movie', movie.id]"
                class="btn btn-outline w-full"
                >Details</a
              >
              <div class="grid grid-cols-2 gap-2 w-full">
                <button
                  (click)="updateStatus(movie.id, 'in-progress')"
                  class="btn btn-warning btn-sm"
                >
                  Mark In Progress
                </button>
                <button
                  (click)="updateStatus(movie.id, 'watched')"
                  class="btn btn-success btn-sm"
                >
                  Mark Watched
                </button>
              </div>
              <button
                (click)="removeFromTracking(movie.id)"
                class="btn btn-error btn-sm w-full"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WatchlistComponent implements OnInit {
  movies: Movie[] = [];
  isLoading = false;
  errorMessage = '';
  trackedMovieIds: number[] = [];

  constructor(
    private movieService: MovieService,
    private trackingService: TrackingService
  ) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Get all movies with 'want-to-watch' status
    const watchlistItems =
      this.trackingService.getMoviesByStatus('want-to-watch');
    this.trackedMovieIds = watchlistItems.map((item) => item.movieId);

    if (this.trackedMovieIds.length === 0) {
      this.isLoading = false;
      return;
    }

    // Fetch details for each movie in the watchlist
    const moviePromises = this.trackedMovieIds.map((movieId) =>
      this.movieService.getMovieDetails(movieId).toPromise()
    );

    Promise.all(moviePromises)
      .then((movies) => {
        this.movies = movies.filter((movie) => movie !== null);
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error fetching watchlist movies', error);
        this.errorMessage =
          'Failed to load your watchlist. Please try again later.';
        this.isLoading = false;
      });
  }

  updateStatus(movieId: number, newStatus: 'in-progress' | 'watched'): void {
    this.trackingService.trackMovie(movieId, newStatus);
    // Remove from this list since status changed
    this.movies = this.movies.filter((movie) => movie.id !== movieId);
  }

  removeFromTracking(movieId: number): void {
    this.trackingService.removeTracking(movieId);
    // Remove from displayed list
    this.movies = this.movies.filter((movie) => movie.id !== movieId);
  }
}

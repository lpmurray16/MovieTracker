import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { TrackingService } from '../../services/tracking.service';
import { Movie, MovieStatus, MovieWithStatus } from '../../types/movie.types';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Search Movies</h2>
      <div class="join w-full max-w-md mx-auto mb-8">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Enter movie title..."
          (keyup.enter)="searchMovies()"
          class="input input-bordered join-item flex-1"
        />
        <button (click)="searchMovies()" class="btn btn-primary join-item">
          Search
        </button>
      </div>

      <div *ngIf="isLoading" class="flex justify-center items-center p-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error mb-4">
        {{ errorMessage }}
      </div>

      <div
        *ngIf="
          !isLoading &&
          !searchResults.length &&
          !errorMessage &&
          searchPerformed
        "
        class="alert alert-info"
      >
        No movies found. Try a different search term.
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        *ngIf="searchResults.length"
      >
        <div
          class="card lg:card-side bg-base-300 shadow-xl"
          *ngFor="let movie of searchResults"
        >
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
              <div class="grid grid-cols-3 gap-2 w-full">
                <button
                  (click)="trackMovie(movie.id, 'want-to-watch')"
                  class="btn btn-primary btn-sm"
                >
                  Want to Watch
                </button>
                <button
                  (click)="trackMovie(movie.id, 'in-progress')"
                  class="btn btn-warning btn-sm"
                >
                  In Progress
                </button>
                <button
                  (click)="trackMovie(movie.id, 'watched')"
                  class="btn btn-success btn-sm"
                >
                  Watched
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  searchResults: Movie[] = [];
  isLoading = false;
  errorMessage = '';
  searchPerformed = false;

  constructor(
    private movieService: MovieService,
    private trackingService: TrackingService
  ) {}

  ngOnInit(): void {
    // Load popular movies when the component initializes
    this.loadPopularMovies();
  }

  loadPopularMovies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getPopularMovies().subscribe({
      next: (response) => {
        this.searchResults = response.results;
        this.isLoading = false;
        this.searchPerformed = true;
      },
      error: (error) => {
        console.error('Error fetching popular movies', error);
        this.errorMessage =
          'Failed to load popular movies. Please try again later.';
        this.isLoading = false;
        this.searchPerformed = true;
      },
    });
  }

  searchMovies(): void {
    if (!this.searchQuery.trim()) {
      this.loadPopularMovies();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];

    this.movieService.searchMovies(this.searchQuery).subscribe({
      next: (response) => {
        this.searchResults = response.results;
        this.isLoading = false;
        this.searchPerformed = true;
      },
      error: (error) => {
        console.error('Error searching movies', error);
        this.errorMessage = 'Failed to search movies. Please try again later.';
        this.isLoading = false;
        this.searchPerformed = true;
      },
    });
  }

  trackMovie(
    movieId: number,
    status: 'want-to-watch' | 'in-progress' | 'watched'
  ): void {
    this.trackingService.trackMovie(movieId, status);
    // Could add a toast notification here
  }
}

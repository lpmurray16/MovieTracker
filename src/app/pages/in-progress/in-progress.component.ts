import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { DatabaseService } from '../../services/database.service';
import { Movie } from '../../types/movie.types';

@Component({
  selector: 'app-in-progress',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Movies In Progress</h2>

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
          You don't have any movies in progress. Start watching something from
          your watchlist!
        </p>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <a routerLink="/search" class="btn btn-outline">Go to Search</a>
          <a routerLink="/watchlist" class="btn btn-primary">Go to Watchlist</a>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        *ngIf="movies.length"
      >
        <div
          class="card lg:card-side bg-base-300 shadow-xl relative"
          *ngFor="let movie of movies"
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
            <a
              [routerLink]="['/movie', movie.id]"
              class="btn btn-outline btn-sm absolute top-2 right-2 z-10"
              >Details</a
            >
            <div class="card-actions flex-col gap-2 mt-4 items-center">
              <div class="grid grid-cols-2 gap-2 w-full">
                <button
                  (click)="updateStatus(movie.documentId!, 'watched')"
                  class="btn btn-success btn-sm"
                >
                  Mark Watched
                </button>
                <button
                  (click)="updateStatus(movie.documentId!, 'want-to-watch')"
                  class="btn btn-primary btn-sm"
                >
                  Move to Watchlist
                </button>
              </div>
              <button
                (click)="removeFromTracking(movie.documentId!)"
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
export class InProgressComponent implements OnInit {
  movies: Movie[] = [];
  isLoading = false;
  errorMessage = '';
  trackedMovieIds: number[] = [];

  constructor(
    private movieService: MovieService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.loadInProgressMovies();
  }

  async loadInProgressMovies(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.movies = await this.databaseService.getMoviesByStatus('in-progress');
    this.isLoading = false;
  }

  async updateStatus(
    movieId: string,
    newStatus: 'want-to-watch' | 'watched'
  ): Promise<void> {
    const success = await this.databaseService.updateMovieStatus(
      movieId,
      newStatus
    );
    if (success) {
      await this.loadInProgressMovies();
    }
  }

  async removeFromTracking(movieId: string): Promise<void> {
    const success = await this.databaseService.removeMovie(movieId);
    if (success) {
      await this.loadInProgressMovies();
    }
  }
}

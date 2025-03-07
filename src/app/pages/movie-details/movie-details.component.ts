import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../types/movie.types';
import { DatabaseService } from '../../services/database.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <div *ngIf="isLoading" class="flex justify-center items-center p-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error mb-4">
        {{ errorMessage }}
      </div>

      <div class="movie-content" *ngIf="movie">
        <div class="mb-4">
          <a routerLink="/search" class="btn btn-ghost btn-sm text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 mr-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Search <i class="fas fa-search"></i>
          </a>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 mb-8">
          <div class="w-full lg:w-1/4 flex-shrink-0">
            <div class="rounded-lg overflow-hidden shadow-lg aspect-w-2 aspect-h-3"> <!-- Added aspect ratio classes -->
              <img
                *ngIf="movie.poster_path"
                [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
                [alt]="movie.title + ' poster'"
                class="w-full h-full object-cover" 
              />
              <div
                *ngIf="!movie.poster_path"
                class="w-full h-full flex items-center justify-center bg-base-200 text-base-content/60 p-8"
              >
                No poster available
              </div>
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-4">{{ movie.title }}</h1>

            <div class="space-y-3 mb-6">
              <p *ngIf="movie.release_date" class="text-sm">
                <span class="font-semibold">Release Date:</span>
                {{ movie.release_date | date : 'longDate' }}
              </p>

              <p *ngIf="movie.vote_average" class="text-sm">
                <span class="font-semibold">Rating:</span> ⭐
                {{ movie.vote_average | number : '1.1-1' }}/10
              </p>
              <!-- Add link to TMDB page -->
          <a
            *ngIf="movie.id"
            [href]="'https://www.themoviedb.org/movie/' + movie.id"
            target="_blank"
            class="btn btn-outline btn-sm mt-4"
          >
            View on TMDB <i class="fas fa-external-link-alt"></i>
          </a>
            </div>
          </div>
          <!-- Overview section in a separate column on large screens -->
          <div class="card bg-base-100 shadow p-6 lg:w-1/3">
            <h2 class="text-xl font-bold mb-3">Overview</h2>
            <p class="text-base-content/80">{{ movie.overview }}</p>
            <div class="card-actions mt-4">
              <!-- Database functionality for tracking movies -->
              <div class="flex flex-col md:flex-row gap-2 w-full">
                <button
                  class="btn btn-primary btn-sm flex-grow-1"
                  (click)="addToWatchlist(movie)"
                >
                  To Watch <i class="fas fa-plus"></i>
                </button>
                <button
                  class="btn btn-warning btn-sm flex-grow-1"
                  (click)="addToInProgress(movie)"
                >
                  In Progress
                </button>
                <button
                  class="btn btn-success btn-sm flex-grow-1"
                  (click)="addToWatched(movie)"
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
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  isLoading = false;
  errorMessage = '';
  movieId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private databaseService: DatabaseService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.movieId = +idParam;
        this.loadMovieDetails();
      } else {
        this.errorMessage = 'Invalid movie ID';
      }
    });
  }

  loadMovieDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getMovieDetails(this.movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching movie details', error);
        this.errorMessage =
          'Failed to load movie details. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  // Methods to add movies to different lists
  addToWatchlist(movie: Movie): void {
    this.databaseService
      .addMovie(movie, 'want-to-watch')
      .then((success) => {
        if (!success) {
          this.alertService.showError('Failed to add movie to watchlist');
        }
      })
      .catch((error) => {
        console.error('Error adding movie to watchlist:', error);
        this.alertService.showError('Failed to add movie to watchlist');
      });
  }

  addToInProgress(movie: Movie): void {
    this.databaseService
      .addMovie(movie, 'in-progress')
      .then((success) => {
        if (!success) {
          this.alertService.showError(
            'Failed to add movie to in-progress list'
          );
        }
      })
      .catch((error) => {
        console.error('Error adding movie to in-progress list:', error);
        this.alertService.showError('Failed to add movie to in-progress list');
      });
  }

  addToWatched(movie: Movie): void {
    this.databaseService
      .addMovie(movie, 'watched')
      .then((success) => {
        if (!success) {
          this.alertService.showError('Failed to add movie to watched list');
        }
      })
      .catch((error) => {
        console.error('Error adding movie to watched list:', error);
        this.alertService.showError('Failed to add movie to watched list');
      });
  }
}

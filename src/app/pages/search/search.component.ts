import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../types/movie.types';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <h2
        class="text-2xl font-bold mb-6 w-full flex items-center justify-center"
      >
        Search Movies
      </h2>
      <div
        class="join w-full max-w-md mx-auto mb-8 flex items-center justify-center"
      >
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Enter movie title..."
          (keyup.enter)="searchMovies()"
          class="input input-bordered join-item flex-1"
        />
        <button (click)="searchMovies()" class="btn btn-primary join-item">
          <i class="fas fa-search"></i>
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
          class="card lg:card-side bg-base-300 shadow-xl relative"
          *ngFor="let movie of searchResults"
        >
          <a
            [routerLink]="['/movie', movie.id]"
            class="btn btn-outline btn-sm absolute top-2 right-2 z-10"
            >Details <i class="fas fa-list"></i
          ></a>
          <figure
            class="lg:w-50 lg:h-full sm:h-50 flex-shrink-0 rounded-l-xl overflow-hidden"
          >
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
              <!-- Database functionality for tracking movies -->
              <div class="grid grid-cols-3 gap-2 w-full">
                <button
                  class="btn btn-primary btn-sm"
                  (click)="addToWatchlist(movie)"
                >
                  To Watch <i class="fas fa-plus"></i>
                </button>
                <button
                  class="btn btn-warning btn-sm"
                  (click)="addToInProgress(movie)"
                >
                  In Progress
                </button>
                <button
                  class="btn btn-success btn-sm"
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

    <!-- Floating Action Button for scrolling to top -->
    <button
      *ngIf="showScrollTopButton"
      (click)="scrollToTop()"
      class="btn btn-circle btn-primary shadow-lg fixed bottom-20 right-4 z-50 animate-fade-in"
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-in-out;
      }
    `,
  ],
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  searchResults: Movie[] = [];
  isLoading = false;
  errorMessage = '';
  searchPerformed = false;
  showScrollTopButton = false;

  constructor(
    private movieService: MovieService,
    private databaseService: DatabaseService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Load popular movies when the component initializes
    this.loadPopularMovies();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Show button when user scrolls down 300px from the top
    this.showScrollTopButton = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

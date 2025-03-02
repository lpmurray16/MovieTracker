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
    <div class="search-container">
      <h2>Search Movies</h2>
      <div class="search-form">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          placeholder="Enter movie title..."
          (keyup.enter)="searchMovies()"
        />
        <button (click)="searchMovies()">Search</button>
      </div>

      <div *ngIf="isLoading" class="loading">
        Loading...
      </div>

      <div *ngIf="errorMessage" class="error">
        {{ errorMessage }}
      </div>

      <div *ngIf="!isLoading && !searchResults.length && !errorMessage && searchPerformed" class="no-results">
        No movies found. Try a different search term.
      </div>

      <div class="movie-grid" *ngIf="searchResults.length">
        <div class="movie-card" *ngFor="let movie of searchResults">
          <div class="movie-poster">
            <img 
              *ngIf="movie.poster_path" 
              [src]="'https://image.tmdb.org/t/p/w300' + movie.poster_path" 
              [alt]="movie.title + ' poster'"
            />
            <div *ngIf="!movie.poster_path" class="no-poster">
              No poster available
            </div>
          </div>
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p class="release-date" *ngIf="movie.release_date">
              {{ movie.release_date | date:'yyyy' }}
            </p>
            <p class="rating" *ngIf="movie.vote_average">
              ⭐ {{ movie.vote_average | number:'1.1-1' }}/10
            </p>
            <p class="overview">{{ movie.overview | slice:0:150 }}{{ movie.overview.length > 150 ? '...' : '' }}</p>
            <div class="actions">
              <a [routerLink]="['/movie', movie.id]" class="details-btn">Details</a>
              <div class="tracking-buttons">
                <button (click)="trackMovie(movie.id, 'want-to-watch')" class="track-btn want-to-watch">
                  Want to Watch
                </button>
                <button (click)="trackMovie(movie.id, 'in-progress')" class="track-btn in-progress">
                  In Progress
                </button>
                <button (click)="trackMovie(movie.id, 'watched')" class="track-btn watched">
                  Watched
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 20px 0;
    }

    .search-form {
      display: flex;
      margin-bottom: 20px;
    }

    input {
      flex: 1;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px 0 0 4px;
    }

    button {
      padding: 10px 20px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      font-size: 16px;
    }

    button:hover {
      background-color: #1565c0;
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .movie-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      background-color: white;
      display: flex;
      flex-direction: column;
    }

    .movie-poster {
      height: 200px;
      overflow: hidden;
    }

    .movie-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-poster {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      color: #777;
    }

    .movie-info {
      padding: 15px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    .release-date, .rating {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
    }

    .overview {
      margin: 0 0 15px 0;
      font-size: 14px;
      line-height: 1.4;
      flex: 1;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .details-btn {
      display: inline-block;
      padding: 8px 16px;
      background-color: #f0f0f0;
      color: #333;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
    }

    .details-btn:hover {
      background-color: #e0e0e0;
    }

    .tracking-buttons {
      display: flex;
      gap: 5px;
    }

    .track-btn {
      flex: 1;
      padding: 6px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      border: none;
    }

    .want-to-watch {
      background-color: #2196f3;
      color: white;
    }

    .in-progress {
      background-color: #ff9800;
      color: white;
    }

    .watched {
      background-color: #4caf50;
      color: white;
    }

    .loading, .error, .no-results {
      text-align: center;
      padding: 20px;
      font-size: 16px;
    }

    .error {
      color: #d32f2f;
    }
  `]
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
        this.errorMessage = 'Failed to load popular movies. Please try again later.';
        this.isLoading = false;
        this.searchPerformed = true;
      }
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
      }
    });
  }

  trackMovie(movieId: number, status: 'want-to-watch' | 'in-progress' | 'watched'): void {
    this.trackingService.trackMovie(movieId, status);
    // Could add a toast notification here
  }
}
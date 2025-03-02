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
    <div class="watchlist-container">
      <h2>Movies You Want to Watch</h2>
      
      <div *ngIf="isLoading" class="loading">
        Loading...
      </div>

      <div *ngIf="errorMessage" class="error">
        {{ errorMessage }}
      </div>

      <div *ngIf="!isLoading && !movies.length" class="empty-list">
        <p>Your watchlist is empty. Start adding movies from the search page!</p>
        <a routerLink="/search" class="search-link">Go to Search</a>
      </div>

      <div class="movie-grid" *ngIf="movies.length">
        <div class="movie-card" *ngFor="let movie of movies">
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
                <button (click)="updateStatus(movie.id, 'in-progress')" class="track-btn in-progress">
                  Mark In Progress
                </button>
                <button (click)="updateStatus(movie.id, 'watched')" class="track-btn watched">
                  Mark Watched
                </button>
                <button (click)="removeFromTracking(movie.id)" class="track-btn remove">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .watchlist-container {
      padding: 20px 0;
    }

    h2 {
      margin-bottom: 20px;
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
      flex-wrap: wrap;
      gap: 5px;
    }

    .track-btn {
      flex: 1;
      padding: 6px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      min-width: 80px;
    }

    .in-progress {
      background-color: #ff9800;
      color: white;
    }

    .watched {
      background-color: #4caf50;
      color: white;
    }

    .remove {
      background-color: #f44336;
      color: white;
    }

    .loading, .error, .empty-list {
      text-align: center;
      padding: 20px;
      font-size: 16px;
    }

    .error {
      color: #d32f2f;
    }

    .empty-list {
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 30px;
    }

    .search-link {
      display: inline-block;
      margin-top: 10px;
      padding: 8px 16px;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }

    .search-link:hover {
      background-color: #1565c0;
    }
  `]
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
    const watchlistItems = this.trackingService.getMoviesByStatus('want-to-watch');
    this.trackedMovieIds = watchlistItems.map(item => item.movieId);
    
    if (this.trackedMovieIds.length === 0) {
      this.isLoading = false;
      return;
    }
    
    // Fetch details for each movie in the watchlist
    const moviePromises = this.trackedMovieIds.map(movieId => 
      this.movieService.getMovieDetails(movieId).toPromise()
    );
    
    Promise.all(moviePromises)
      .then(movies => {
        this.movies = movies.filter(movie => movie !== null);
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error fetching watchlist movies', error);
        this.errorMessage = 'Failed to load your watchlist. Please try again later.';
        this.isLoading = false;
      });
  }

  updateStatus(movieId: number, newStatus: 'in-progress' | 'watched'): void {
    this.trackingService.trackMovie(movieId, newStatus);
    // Remove from this list since status changed
    this.movies = this.movies.filter(movie => movie.id !== movieId);
  }

  removeFromTracking(movieId: number): void {
    this.trackingService.removeTracking(movieId);
    // Remove from displayed list
    this.movies = this.movies.filter(movie => movie.id !== movieId);
  }
}
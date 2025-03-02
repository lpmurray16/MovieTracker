import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { TrackingService } from '../../services/tracking.service';
import { Movie, MovieStatus } from '../../types/movie.types';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="movie-details-container">
      <div *ngIf="isLoading" class="loading">
        Loading...
      </div>

      <div *ngIf="errorMessage" class="error">
        {{ errorMessage }}
      </div>

      <div *ngIf="!isLoading && !movie" class="not-found">
        <p>Movie not found. The movie might have been removed or the ID is invalid.</p>
        <a routerLink="/search" class="back-link">Back to Search</a>
      </div>

      <div class="movie-content" *ngIf="movie">
        <div class="back-navigation">
          <a routerLink="/search" class="back-link">← Back to Search</a>
        </div>

        <div class="movie-header">
          <div class="movie-poster">
            <img 
              *ngIf="movie.poster_path" 
              [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
              [alt]="movie.title + ' poster'"
            />
            <div *ngIf="!movie.poster_path" class="no-poster">
              No poster available
            </div>
          </div>
          
          <div class="movie-info">
            <h1>{{ movie.title }}</h1>
            
            <div class="movie-meta">
              <p *ngIf="movie.release_date" class="release-date">
                <strong>Release Date:</strong> {{ movie.release_date | date:'longDate' }}
              </p>
              
              <p *ngIf="movie.vote_average" class="rating">
                <strong>Rating:</strong> ⭐ {{ movie.vote_average | number:'1.1-1' }}/10
              </p>
              
              <div class="tracking-status" *ngIf="movieStatus">
                <p>
                  <strong>Status:</strong> 
                  <span [ngClass]="{
                    'status-want-to-watch': movieStatus.status === 'want-to-watch',
                    'status-in-progress': movieStatus.status === 'in-progress',
                    'status-watched': movieStatus.status === 'watched'
                  }">
                    {{ getStatusLabel(movieStatus.status) }}
                  </span>
                </p>
                <p class="last-updated">
                  <small>Last updated: {{ movieStatus.lastUpdated | date:'medium' }}</small>
                </p>
              </div>
            </div>
            
            <div class="tracking-buttons">
              <button 
                (click)="trackMovie('want-to-watch')" 
                class="track-btn want-to-watch"
                [class.active]="movieStatus?.status === 'want-to-watch'"
              >
                Want to Watch
              </button>
              <button 
                (click)="trackMovie('in-progress')" 
                class="track-btn in-progress"
                [class.active]="movieStatus?.status === 'in-progress'"
              >
                In Progress
              </button>
              <button 
                (click)="trackMovie('watched')" 
                class="track-btn watched"
                [class.active]="movieStatus?.status === 'watched'"
              >
                Watched
              </button>
              <button 
                *ngIf="movieStatus" 
                (click)="removeFromTracking()" 
                class="track-btn remove"
              >
                Remove Tracking
              </button>
            </div>
          </div>
        </div>

        <div class="movie-overview">
          <h2>Overview</h2>
          <p>{{ movie.overview }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-details-container {
      padding: 20px 0;
      max-width: 1000px;
      margin: 0 auto;
    }

    .back-navigation {
      margin-bottom: 20px;
    }

    .back-link {
      display: inline-block;
      padding: 8px 16px;
      background-color: #f0f0f0;
      color: #333;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .back-link:hover {
      background-color: #e0e0e0;
    }

    .movie-header {
      display: flex;
      gap: 30px;
      margin-bottom: 30px;
    }

    .movie-poster {
      flex: 0 0 300px;
      height: 450px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .movie-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-poster {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      color: #777;
    }

    .movie-info {
      flex: 1;
    }

    h1 {
      margin: 0 0 20px 0;
      font-size: 32px;
      color: #333;
    }

    .movie-meta {
      margin-bottom: 20px;
    }

    .movie-meta p {
      margin: 10px 0;
      font-size: 16px;
    }

    .tracking-status {
      margin-top: 15px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .status-want-to-watch {
      color: #2196f3;
      font-weight: bold;
    }

    .status-in-progress {
      color: #ff9800;
      font-weight: bold;
    }

    .status-watched {
      color: #4caf50;
      font-weight: bold;
    }

    .last-updated {
      color: #666;
    }

    .tracking-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }

    .track-btn {
      padding: 10px 15px;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      transition: opacity 0.3s;
    }

    .track-btn.active {
      opacity: 0.7;
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

    .remove {
      background-color: #f44336;
      color: white;
    }

    .movie-overview {
      margin-top: 30px;
    }

    .movie-overview h2 {
      margin-bottom: 15px;
      font-size: 24px;
      color: #333;
    }

    .movie-overview p {
      font-size: 16px;
      line-height: 1.6;
    }

    .loading, .error, .not-found {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin: 20px 0;
    }

    .error {
      color: #d32f2f;
    }

    @media (max-width: 768px) {
      .movie-header {
        flex-direction: column;
      }

      .movie-poster {
        flex: 0 0 auto;
        height: auto;
        max-height: 450px;
        margin-bottom: 20px;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  movieStatus: MovieStatus | undefined;
  isLoading = false;
  errorMessage = '';
  movieId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private trackingService: TrackingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
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
        this.movieStatus = this.trackingService.getMovieStatus(this.movieId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching movie details', error);
        this.errorMessage = 'Failed to load movie details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  trackMovie(status: 'want-to-watch' | 'in-progress' | 'watched'): void {
    if (this.movieId) {
      this.trackingService.trackMovie(this.movieId, status);
      this.movieStatus = this.trackingService.getMovieStatus(this.movieId);
    }
  }

  removeFromTracking(): void {
    if (this.movieId) {
      this.trackingService.removeTracking(this.movieId);
      this.movieStatus = undefined;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'want-to-watch':
        return 'Want to Watch';
      case 'in-progress':
        return 'In Progress';
      case 'watched':
        return 'Watched';
      default:
        return status;
    }
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MovieStatus, MovieWithStatus } from '../types/movie.types';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private readonly STORAGE_KEY = 'movie-tracker-data';
  private trackedMoviesSubject = new BehaviorSubject<MovieStatus[]>([]);
  
  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Convert string dates back to Date objects
        const processedData = parsedData.map((item: any) => ({
          ...item,
          lastUpdated: new Date(item.lastUpdated)
        }));
        this.trackedMoviesSubject.next(processedData);
      } catch (e) {
        console.error('Error parsing tracked movies from localStorage', e);
        this.trackedMoviesSubject.next([]);
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.trackedMoviesSubject.value)
    );
  }

  getTrackedMovies(): Observable<MovieStatus[]> {
    return this.trackedMoviesSubject.asObservable();
  }

  getMovieStatus(movieId: number): MovieStatus | undefined {
    return this.trackedMoviesSubject.value.find(m => m.movieId === movieId);
  }

  trackMovie(movieId: number, status: 'want-to-watch' | 'in-progress' | 'watched'): void {
    const currentMovies = this.trackedMoviesSubject.value;
    const existingIndex = currentMovies.findIndex(m => m.movieId === movieId);
    
    if (existingIndex >= 0) {
      // Update existing entry
      const updatedMovies = [...currentMovies];
      updatedMovies[existingIndex] = {
        ...updatedMovies[existingIndex],
        status,
        lastUpdated: new Date()
      };
      this.trackedMoviesSubject.next(updatedMovies);
    } else {
      // Add new entry
      const newMovieStatus: MovieStatus = {
        movieId,
        status,
        lastUpdated: new Date()
      };
      this.trackedMoviesSubject.next([...currentMovies, newMovieStatus]);
    }
    
    this.saveToLocalStorage();
  }

  removeTracking(movieId: number): void {
    const currentMovies = this.trackedMoviesSubject.value;
    const updatedMovies = currentMovies.filter(m => m.movieId !== movieId);
    
    if (updatedMovies.length !== currentMovies.length) {
      this.trackedMoviesSubject.next(updatedMovies);
      this.saveToLocalStorage();
    }
  }

  getMoviesByStatus(status: 'want-to-watch' | 'in-progress' | 'watched'): MovieStatus[] {
    return this.trackedMoviesSubject.value.filter(m => m.status === status);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../types/movie.types';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = import.meta.env.NG_APP_TMDB_API_KEY;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<{ results: Movie[] }> {
    return this.http.get<{ results: Movie[] }>(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query: query,
      },
    });
  }

  getMovieDetails(movieId: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movie/${movieId}`, {
      params: {
        api_key: this.apiKey,
      },
    });
  }

  getPopularMovies(): Observable<{ results: Movie[] }> {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/movie/popular`,
      {
        params: {
          api_key: this.apiKey,
        },
      }
    );
  }
}

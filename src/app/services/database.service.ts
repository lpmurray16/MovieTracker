import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { Movie } from '../types/movie.types';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private auth: AuthService,
    private firestore: Firestore,
    private alertService: AlertService
  ) {}

  // Basic database operations will be implemented here
  async addMovie(
    movie: Movie,
    status: 'want-to-watch' | 'in-progress' | 'watched'
  ) {
    try {
      const userId = await this.auth.getUserId();
      const movieData = {
        ...movie,
        userId,
        status,
        lastUpdated: new Date(),
      };

      const moviesRef = collection(this.firestore, 'movies');
      await addDoc(moviesRef, movieData);
      this.alertService.showSuccess(
        `"${movie.title}" added to your ${status} list`
      );
      return true;
    } catch (error) {
      console.error('Error adding movie:', error);
      this.alertService.showError('Failed to add movie. Please try again.');
      return false;
    }
  }

  async updateMovieStatus(
    movieId: string,
    newStatus: 'want-to-watch' | 'in-progress' | 'watched'
  ) {
    try {
      const movieRef = doc(this.firestore, 'movies', movieId);
      await updateDoc(movieRef, {
        status: newStatus,
        lastUpdated: new Date(),
      });
      this.alertService.showSuccess(`Movie status updated to ${newStatus}`);
      return true;
    } catch (error) {
      console.error('Error updating movie status:', error);
      this.alertService.showError(
        'Failed to update movie status. Please try again.'
      );
      return false;
    }
  }

  async removeMovie(movieId: string) {
    try {
      const movieRef = doc(this.firestore, 'movies', movieId);
      await deleteDoc(movieRef);
      this.alertService.showSuccess('Movie removed from your list');
      return true;
    } catch (error) {
      console.error('Error removing movie:', error);
      this.alertService.showError('Failed to remove movie. Please try again.');
      return false;
    }
  }

  async getMoviesByStatus(status: 'want-to-watch' | 'in-progress' | 'watched') {
    try {
      const userId = await this.auth.getUserId();
      const moviesRef = collection(this.firestore, 'movies');
      const q = query(
        moviesRef,
        where('userId', '==', userId),
        where('status', '==', status)
      );
      const querySnapshot = await getDocs(q);

      const movies: any[] = [];
      querySnapshot.forEach((doc) => {
        movies.push({
          ...doc.data(),
          documentId: doc.id
        });
      });

      return movies;
    } catch (error) {
      console.error(`Error getting ${status} movies:`, error);
      this.alertService.showError(
        `Failed to load your ${status} list. Please try again.`
      );
      return [];
    }
  }
}

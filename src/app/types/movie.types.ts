export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface MovieStatus {
  userId: string;
  movieId: number;
  status: 'want-to-watch' | 'in-progress' | 'watched';
  lastUpdated: Date;
}

export interface MovieWithStatus extends Movie {
  status?: MovieStatus;
}
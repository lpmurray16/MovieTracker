export interface Movie extends MovieStatus {
  id: number;
  documentId?: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface MovieStatus {
  userId: string;
  status: 'want-to-watch' | 'in-progress' | 'watched';
  lastUpdated: Date;
}
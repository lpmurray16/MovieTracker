// This file uses Netlify's environment variable replacement during build
// https://docs.netlify.com/configure-builds/environment-variables/#declare-variables
export const environment = {
  production: false,
  firebase: {
    apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
    authDomain: 'movie-tracker-c5ee4.firebaseapp.com',
    projectId: 'movie-tracker-c5ee4',
    storageBucket: 'movie-tracker-c5ee4.firebasestorage.app',
    messagingSenderId: '1069302249731',
    appId: '1:1069302249731:web:5a95e3a54bff298df01136',
  },
  tmdb: {
    apiKey: import.meta.env.NG_APP_TMDB_API_KEY,
  },
};

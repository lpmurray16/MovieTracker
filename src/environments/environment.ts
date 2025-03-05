// This file uses Netlify's environment variable replacement during build
// https://docs.netlify.com/configure-builds/environment-variables/#declare-variables
export const environment = {
  production: true,
  firebase: {
    apiKey: '___FIREBASE_API_KEY___',
    authDomain: '___FIREBASE_AUTH_DOMAIN___',
    projectId: '___FIREBASE_PROJECT_ID___',
    storageBucket: '___FIREBASE_STORAGE_BUCKET___',
    messagingSenderId: '___FIREBASE_MESSAGING_SENDER_ID___',
    appId: '___FIREBASE_APP_ID___',
  },
  tmdb: {
    apiKey: '___TMDB_API_KEY___',
  },
};

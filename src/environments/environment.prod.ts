// This file uses Netlify's environment variable replacement during build
// https://docs.netlify.com/configure-builds/environment-variables/#declare-variables
export const environment = {
  production: true,
  firebase: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: '${FIREBASE_AUTH_DOMAIN}',
    projectId: '${FIREBASE_PROJECT_ID}',
    storageBucket: '${FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${FIREBASE_APP_ID}',
  },
  tmdb: {
    apiKey: '${TMDB_API_KEY}',
  },
};

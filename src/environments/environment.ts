export const environment = {
  production: false,
  firebase: {
    apiKey:
      typeof process !== 'undefined'
        ? process.env['FIREBASE_API_KEY']
        : 'REPLACE_WITH_FIREBASE_API_KEY',
    authDomain:
      typeof process !== 'undefined'
        ? process.env['FIREBASE_AUTH_DOMAIN']
        : 'REPLACE_WITH_FIREBASE_AUTH_DOMAIN',
    projectId:
      typeof process !== 'undefined'
        ? process.env['FIREBASE_PROJECT_ID']
        : 'REPLACE_WITH_FIREBASE_PROJECT_ID',
    storageBucket:
      typeof process !== 'undefined'
        ? process.env['FIREBASE_STORAGE_BUCKET']
        : 'REPLACE_WITH_FIREBASE_STORAGE_BUCKET',
    messagingSenderId:
      typeof process !== 'undefined'
        ? process.env['FIREBASE_MESSAGING_SENDER_ID']
        : 'REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID',
    appId:
      typeof process !== 'undefined'
        ? process.env['FIREBASE_APP_ID']
        : 'REPLACE_WITH_FIREBASE_APP_ID',
  },
  tmdb: {
    apiKey:
      typeof process !== 'undefined'
        ? process.env['TMDB_API_KEY']
        : 'REPLACE_WITH_TMDB_API_KEY',
  },
};

import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import { GameService } from './services/game';

const cors = require('cors')({
  origin: true,
});

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    response.status(200).json({ data: { text: "Hello Sharded Cards!" }});
  });
});

export const newGame = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    response.status(200).json({ data: { game: GameService.newGame().json(true, true) }});
  });
});

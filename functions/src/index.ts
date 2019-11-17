import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const cors = require('cors')({
  origin: true,
});

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    response.status(200).json({ data: { text: "Hello Sharded Cards!" }});
  });
});

export { newGame } from './routes/game';
export { generateSeed, updatedTags } from './routes/admin';
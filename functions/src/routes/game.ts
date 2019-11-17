import * as functions from 'firebase-functions';
import { GameService } from '../services/game';

const cors = require('cors')({
  origin: true,
});

export const newGame = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    response.status(200).json({ data: { game: GameService.newGame().json(true, true) }});
  });
});

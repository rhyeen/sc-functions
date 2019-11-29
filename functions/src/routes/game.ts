import * as functions from 'firebase-functions';
import { GameService } from '../services/game';

const cors = require('cors')({
  origin: true,
});

export const newGame = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      if (!request.body.playerId) {
        response.status(400).json({ data: { err: 'playerId in body cannot be empty' }});
        return;
      }
      if (!request.body.playerDeckId) {
        response.status(400).json({ data: { err: 'playerDeckId in body cannot be empty' }});
        return;
      }
      if (!request.body.dungeonId) {
        response.status(400).json({ data: { err: 'dungeonId in body cannot be empty' }});
        return;
      }
      const game = await GameService.newGame(request.body.playerId, request.body.playerDeckId, request.body.dungeonId);
      response.status(200).json({ data: { game: game.json(true, true) }});
    } catch (err) {
      console.error(err);
      response.status(500).json({ data: { msg: 'something unexpected occurred' }});
    }
  });
});

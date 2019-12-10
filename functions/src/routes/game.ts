import * as functions from 'firebase-functions';
import { GameService } from '../services/game';

const cors = require('cors')({
  origin: true,
});

export const newGame = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      if (!request.body.data) {
        response.status(400).json({ data: { err: 'body properties must be wrapped in "data" object' }});
        return;
      }
      const playerId = request.body.data.playerId;
      const playerDeckId = request.body.data.playerDeckId;
      const dungeonId = request.body.data.dungeonId;
      if (!playerId) {
        response.status(400).json({ data: { err: 'playerId in body.data cannot be empty' }});
        return;
      }
      if (!playerDeckId) {
        response.status(400).json({ data: { err: 'playerDeckId in body.data cannot be empty' }});
        return;
      }
      if (!dungeonId) {
        response.status(400).json({ data: { err: 'dungeonId in body.data cannot be empty' }});
        return;
      }
      const game = await GameService.newGame(playerId, playerDeckId, dungeonId);
      response.status(200).json({ data: { game: game.json(true, true) }});
    } catch (err) {
      console.error(err);
      response.status(500).json({ data: { msg: 'something unexpected occurred' }});
    }
  });
});

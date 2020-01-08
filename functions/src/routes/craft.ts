import * as functions from 'firebase-functions';
import { CardService } from '../services/card';
import { CraftService } from '../services/craft';

const cors = require('cors')({
  origin: true,
});

export const getCardNames = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      if (!request.body.data) {
        response.status(400).json({ data: { err: 'body properties must be wrapped in "data" object' }});
        return;
      }
      const cardHash = request.body.data.cardHash;
      if (!cardHash) {
        response.status(400).json({ data: { err: 'cardHash in body.data cannot be empty' }});
        return;
      }
      const cardOrigin = await CardService.getCardOrigin(cardHash);
      if (cardOrigin) {
        response.status(200).json({ data: { origin: cardOrigin.json() }});
        return;
      }
      const cardNames = await CraftService.getPossibleCardNames(cardHash);
      response.status(200).json({ data: { names: cardNames }});
    } catch (err) {
      console.error(err);
      response.status(500).json({ data: { msg: 'something unexpected occurred' }});
    }
  });
});

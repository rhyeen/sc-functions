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
        response.status(200).json({ data: { cardOrigin: cardOrigin.json() }});
        return;
      }
      const cardNames = await CraftService.getPossibleCardNames(cardHash);
      const cardNamesData = cardNames.map(cardName => cardName.json());
      response.status(200).json({ data: { names: cardNamesData }});
    } catch (err) {
      console.error(err);
      response.status(500).json({ data: { msg: 'something unexpected occurred' }});
    }
  });
});


export const createCard = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      if (!request.body.data) {
        response.status(400).json({ data: { err: 'body properties must be wrapped in "data" object' }});
        return;
      }
      const cardName = request.body.data.cardName;
      if (!cardName) {
        response.status(400).json({ data: { err: 'cardName in body.data cannot be empty' }});
        return;
      }
      if (!cardName.id || !cardName.name) {
        response.status(400).json({ data: { err: 'cardName in body.data should have the properties "id" and "name"' }});
        return;
      }
      const cardHash = request.body.data.cardHash;
      if (!cardHash) {
        response.status(400).json({ data: { err: 'cardHash in body.data cannot be empty' }});
        return;
      }
      const gameId = request.body.data.gameId;
      if (!gameId) {
        response.status(400).json({ data: { err: 'gameId in body.data cannot be empty' }});
        return;
      }
      const playerId = request.body.data.playerId;
      if (!playerId) {
        response.status(400).json({ data: { err: 'playerId in body.data cannot be empty' }});
        return;
      }
      if (!CraftService.isValidCardName(cardHash, cardName)) {
        response.status(400).json({ data: { err: 'cardName is not valid for cardHash' }});
        return;
      }
      let card = CraftService.getCardInterface(cardHash, cardName);
      const cardOrigin = await CardService.createCardOrigin(card, playerId, gameId);
      response.status(200).json({ data: { cardOrigin: cardOrigin.json() }});
    } catch (err) {
      console.error(err);
      response.status(500).json({ data: { msg: 'something unexpected occurred' }});
    }
  });
});

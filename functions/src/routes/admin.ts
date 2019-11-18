import * as functions from 'firebase-functions';

import { firestoreDB } from '../services/firestore';

const cors = require('cors')({
  origin: true,
});

async function validateAdminToken(adminToken) {
  const adminUser = await firestoreDB.collection('admintokens').doc(adminToken).get();
  return adminUser.exists;
}

export const generateSeed = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      if (!request.body.data.adminToken) {
        response.status(400).json({ data: { err: 'adminToken in body cannot be empty' }});
        return;
      }
      const isAdmin = await validateAdminToken(request.body.data.adminToken);
      if (!isAdmin) {
        response.status(403).json({ data: { err: 'invalid adminToken' }});
        return;
      }
      if (!request.body.data.body.dungeonId) {
        response.status(400).json({ data: { err: 'dungeonId in body cannot be empty' }});
        return;
      }
      const dungeonCondition = await firestoreDB.collection('dungeonconditions').doc(request.body.data.body.dungeonId).get();
      const dungeonConditionData = dungeonCondition.data();
      const cardIds = Object.keys(dungeonConditionData.cards);
      const promises = [];
      for (const cardId of cardIds) {
        promises.push(firestoreDB.collection('dungeoncards').doc(cardId).get());
      }
      const dungeonCards = await Promise.all(promises);
      const dungeonSeed = { 
        ...dungeonConditionData,
        dungeoncards: {}
      };
      for (const dungeonCard of dungeonCards) {
        let dungeonCardData = dungeonCard.data();
        dungeonSeed.dungeoncards[dungeonCardData.id] = dungeonCardData;
      }
      const dungeonSeedRef = await firestoreDB.collection('dungeonseeds').add(dungeonSeed);
      response.status(200).json({ data: { seed: dungeonSeedRef.id }});
    } catch (err) {
      console.error(err);
      response.status(500).json({ data: { err }});
    }
  });
});

export const updateTags = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
      response.status(200).json({ data: { ok: true }});
  });
});
